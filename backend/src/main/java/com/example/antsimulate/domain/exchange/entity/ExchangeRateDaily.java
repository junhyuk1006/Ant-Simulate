package com.example.antsimulate.domain.exchange.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "exchange_rate_daily")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ExchangeRateDaily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "base_currency")
    private String baseCurrency;

    @Column(nullable = false, name = "quote_currency")
    private String quoteCurrency;

    @Column(nullable = false, name = "rate_date")
    private LocalDate rateDate;

    @Column(nullable = false, name = "rate")
    private BigDecimal rate;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
}
