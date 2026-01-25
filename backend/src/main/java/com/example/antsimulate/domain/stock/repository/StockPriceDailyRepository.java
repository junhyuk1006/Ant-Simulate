package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockPriceDailyRepository extends JpaRepository<StockPriceDaily, Long> {
}
