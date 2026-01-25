package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.entity.StockItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockItemsRepository extends JpaRepository<StockItems, Long> {
    Optional<StockItems> findByStockSymbol(String stockSymbol);
}
