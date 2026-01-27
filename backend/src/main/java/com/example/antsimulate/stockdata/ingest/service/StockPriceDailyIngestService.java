package com.example.antsimulate.stockdata.ingest.service;

import com.example.antsimulate.stockdata.ingest.client.TwelveDataClient;
import com.example.antsimulate.stockdata.ingest.dto.TwelveTimeSeriesResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockPriceDailyIngestService {
    private final TwelveDataClient client;
    private final NamedParameterJdbcTemplate jdbc;

    @Transactional
    public int ingestDailyBySymbol(long stockItemId, String symbol, int outputsize){
        TwelveTimeSeriesResponse response = client.fetchDailySeriesRaw(symbol, outputsize);

        if(response == null || !"ok".equalsIgnoreCase(response.status) || response.values == null){
            throw new IllegalStateException("TwelveData response not ok");
        }

        String sql = """
                INSERT INTO stock_price_daily
                    (stock_item_id, trade_date, open_price, high_price, low_price, close_price, volume)
                VALUES
                    (:stockItemId, :tradeDate, :open, :high, :low, :close, :volume)
                ON CONFLICT (stock_item_id, trade_date) DO NOTHING
                """;

        List<MapSqlParameterSource> batch = new ArrayList<>(response.values.size());

        for (TwelveTimeSeriesResponse.Value v : response.values){
            LocalDate tradeDate = LocalDate.parse(v.datetime);

            BigDecimal open  = new BigDecimal(v.open);
            BigDecimal high  = new BigDecimal(v.high);
            BigDecimal low   = new BigDecimal(v.low);
            BigDecimal close = new BigDecimal(v.close);
            long volume      = Long.parseLong(v.volume);

            if (high.compareTo(low) < 0) continue;

            batch.add(new MapSqlParameterSource()
                    .addValue("stockItemId", stockItemId)
                    .addValue("tradeDate", tradeDate)
                    .addValue("open", open)
                    .addValue("high", high)
                    .addValue("low", low)
                    .addValue("close", close)
                    .addValue("volume", volume));
        }

        int[] counts = jdbc.batchUpdate(sql, batch.toArray(MapSqlParameterSource[]::new));

        return counts.length;
    }
}
