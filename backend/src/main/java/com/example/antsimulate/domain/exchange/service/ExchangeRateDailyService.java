package com.example.antsimulate.domain.exchange.service;

import com.example.antsimulate.domain.exchange.dto.GetLastExchangeRateResponse;
import com.example.antsimulate.domain.exchange.entity.ExchangeRateDaily;
import com.example.antsimulate.domain.exchange.repository.ExchangeRateDailyRepository;
import com.example.antsimulate.global.exception.BusinessException;
import com.example.antsimulate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangeRateDailyService {
    private final ExchangeRateDailyRepository exchangeRateDailyRepository;

    public GetLastExchangeRateResponse getLastExchangeRate(String baseCurrency, String quoteCurrency){

        ExchangeRateDaily exchangeRateDaily = exchangeRateDailyRepository.findTopByBaseCurrencyAndQuoteCurrencyOrderByRateDateDesc(baseCurrency, quoteCurrency)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXCHANGE_RATE_NOT_FOUND));

        return new GetLastExchangeRateResponse(exchangeRateDaily.getRateDate(), exchangeRateDaily.getRate());
    }
}
