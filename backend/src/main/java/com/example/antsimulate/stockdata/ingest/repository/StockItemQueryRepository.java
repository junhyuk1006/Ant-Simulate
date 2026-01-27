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
                SELECT id, stock_symbol
                FROM stock_items
                WHERE stock_type = 'NASDAQ'
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
