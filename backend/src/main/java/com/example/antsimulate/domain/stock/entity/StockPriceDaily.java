package com.example.antsimulate.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "stock_price_daily")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockPriceDaily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "stock_item_id")
    private StockItems stockItems;

    @Column(nullable = false, name = "trade_date")
    private LocalDate tradeDate;

    @Column(nullable = false, name = "open_price")
    private BigDecimal openPrice;

    @Column(nullable = false, name = "high_price")
    private BigDecimal highPrice;

    @Column(nullable = false, name = "low_price")
    private BigDecimal lowPrice;

    @Column(nullable = false, name = "close_price")
    private BigDecimal closePrice;

    @Column(nullable = false, name = "volume")
    private Long volume;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @Column(nullable = false, name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
}
