package com.example.antsimulate.domain.stock.service;

import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import com.example.antsimulate.domain.stock.repository.StockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockPriceDailyRepository;
import com.example.antsimulate.infra.stock.AlphaVantageClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlphaStockPriceIngestService {
    private final AlphaVantageClient alphaVantageClient;
    private final StockItemsRepository stockItemsRepository;
    private final StockPriceDailyRepository stockPriceDailyRepository;
    private final ObjectMapper objectMapper;

    @Value("${alphavantage.api-key}")
    private String apikey;

    public String fetchDailyFullJson(String symbol){
        return alphaVantageClient.fetchDailyFull(symbol,apikey);
    }

    @Transactional
    public void ingestDailyPrices(String symbol) throws Exception {
        StockItems stockItems = stockItemsRepository.findByStockSymbol(symbol)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 종목"));

        String json = alphaVantageClient.fetchDailyFull(symbol, apikey);

        JsonNode root = objectMapper.readTree(json);

        if (root.has("Error Message")) {
            throw new IllegalStateException("AlphaVantage Error: " + root.get("Error Message").asText());
        }

        if (root.has("Note")) {
            throw new IllegalStateException(
                    "AlphaVantage Note: " + root.get("Note").asText()
            );
        }

        if (root.has("Information")) {
            throw new IllegalStateException(
                    "AlphaVantage Information: " + root.get("Information").asText()
            );
        }

        JsonNode timeSeriesNode = root.get("Time Series (Daily)");

        if (timeSeriesNode == null || timeSeriesNode.isNull()) {
            throw new IllegalStateException("Time Series (Daily) 없음. 응답 확인 필요: " + root.toString());
        }

        List<StockPriceDaily> toSave = new ArrayList<>();
        Iterator<Map.Entry<String, JsonNode>> fields = timeSeriesNode.fields();
        while (fields.hasNext()){
            Map.Entry<String, JsonNode> entry = fields.next();
            LocalDate tradeDate = LocalDate.parse(entry.getKey());

            JsonNode daily = entry.getValue();

            JsonNode openNode = daily.get("1. open");
            JsonNode highNode = daily.get("2. high");
            JsonNode lowNode  = daily.get("3. low");
            JsonNode closeNode= daily.get("4. close");
            JsonNode volNode  = daily.get("5. volume");

            // 필수값 하나라도 없으면 해당 날짜 스킵
            if (openNode == null || highNode == null || lowNode == null
                    || closeNode == null || volNode == null) {
                continue;
            }

            BigDecimal open  = new BigDecimal(openNode.asText());
            BigDecimal high  = new BigDecimal(highNode.asText());
            BigDecimal low   = new BigDecimal(lowNode.asText());
            BigDecimal close = new BigDecimal(closeNode.asText());
            long volume      = volNode.asLong();

            StockPriceDaily entity = StockPriceDaily.builder()
                    .stockItems(stockItems)
                    .tradeDate(tradeDate)
                    .openPrice(open)
                    .highPrice(high)
                    .lowPrice(low)
                    .closePrice(close)
                    .volume(volume)
                    .build();

            toSave.add(entity);
        }

        stockPriceDailyRepository.saveAll(toSave);
    }
}
