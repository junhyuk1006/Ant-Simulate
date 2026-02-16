package com.example.antsimulate.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GetLastExchangeRateResponse {
    private LocalDate rateDate;
    private BigDecimal rate;
}
