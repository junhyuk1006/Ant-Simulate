package com.example.antsimulate.domain.exchange.repository;

import com.example.antsimulate.domain.exchange.entity.ExchangeRateDaily;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExchangeRateDailyRepository extends JpaRepository<ExchangeRateDaily, Long> {
    Optional<ExchangeRateDaily> findTopByBaseCurrencyAndQuoteCurrencyOrderByRateDateDesc(String baseCurrency, String quoteCurrency);
}
