package com.example.antsimulate.domain.stock.service;

import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import com.example.antsimulate.domain.stock.repository.StockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockPriceDailyRepository;
import com.example.antsimulate.infra.stock.YahooFinanceClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class YahooStockPriceIngestService {
    private final YahooFinanceClient yahooFinanceClient;
    private final StockItemsRepository stockItemsRepository;
    private final StockPriceDailyRepository stockPriceDailyRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void ingestDailyPrices(String symbol, LocalDate from, LocalDate to) throws Exception {
        StockItems stockItems = stockItemsRepository.findByStockSymbol(symbol)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 종목"));

        long period1 = toEpochSecondNY(from);
        long period2 = toEpochSecondNY(to.plusDays(1));

        String json = yahooFinanceClient.fetchDailyChartJson(symbol, period1, period2);

        JsonNode root = objectMapper.readTree(json);
        JsonNode result = root.path("chart").path("result").get(0);

        if (result == null || result.isNull()) {
            throw new IllegalStateException("Yahoo chart result 없음");
        }

        JsonNode timestamps = result.path("timestamp");
        JsonNode quote = result.path("indicators").path("quote").get(0);

        List<StockPriceDaily> toSave = new ArrayList<>();

        for (int i = 0; i < timestamps.size(); i++) {
            LocalDate tradeDate = Instant.ofEpochSecond(timestamps.get(i).asLong())
                    .atZone(ZoneId.of("America/New_York"))
                    .toLocalDate();

            StockPriceDaily entity = StockPriceDaily.builder()
                    .stockItems(stockItems)
                    .tradeDate(tradeDate)
                    .openPrice(bd(quote.path("open").get(i)))
                    .highPrice(bd(quote.path("high").get(i)))
                    .lowPrice(bd(quote.path("low").get(i)))
                    .closePrice(bd(quote.path("close").get(i)))
                    .volume(quote.path("volume").get(i).asLong())
                    .build();

            toSave.add(entity);
        }

        stockPriceDailyRepository.saveAll(toSave);
    }

    private static BigDecimal bd(JsonNode node) {
        return node == null || node.isNull() ? null : node.decimalValue();
    }

    private static long toEpochSecondNY(LocalDate date) {
        return date.atStartOfDay(ZoneId.of("America/New_York"))
                .toEpochSecond();
    }
}
