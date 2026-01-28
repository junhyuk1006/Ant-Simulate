package com.example.antsimulate.stockdata.ingest.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class StockItemQueryRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<StockITemRows> findTodayTargets(int limit){
        String sql = """
                SELECT si.id, si.stock_symbol
                FROM stock_items si
                LEFT JOIN stock_price_daily spd
                ON si.id = spd.stock_item_id
                WHERE si.stock_type = 'NASDAQ'
                AND spd.stock_item_id IS NULL
                ORDER BY id
                LIMIT ?
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new StockITemRows(
                        rs.getLong("id"),
                        rs.getString("stock_symbol")
                ),
                limit
        );
    }

    public record StockITemRows(long id, String symbol){}
}
