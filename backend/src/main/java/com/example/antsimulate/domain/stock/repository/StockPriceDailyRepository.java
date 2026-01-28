package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockPriceDailyRepository extends JpaRepository<StockPriceDaily, Long> {

    @Query("""
            SELECT new com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse(
                spd.id,
                si.stockName,
                spd.tradeDate,
                spd.openPrice,
                spd.highPrice,
                spd.lowPrice,
                spd.closePrice,
                spd.volume
            ) 
            FROM StockPriceDaily spd
            INNER JOIN spd.stockItems si
            WHERE spd.id = :stockId
            ORDER BY spd.tradeDate
        """)
    List<GetStockPriceDailyResponse> findDailyPrices(@Param("stockId") Long stockId);
}
