package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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
            WHERE spd.stockItems.id = :stockItemId
            ORDER BY spd.tradeDate
        """)
    List<GetStockPriceDailyResponse> findDailyPricesList(@Param("stockItemId") Long stockItemId);

    Optional<StockPriceDaily> findTop1ByStockItems_IdOrderByTradeDateDesc(Long StockItemId);
}
