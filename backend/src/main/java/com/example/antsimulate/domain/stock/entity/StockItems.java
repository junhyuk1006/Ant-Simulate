package com.example.antsimulate.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stock_items")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class StockItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "stock_symbol")
    private String stockSymbol;

    @Column(nullable = false, name= "stock_name")
    private String stockName;
}
