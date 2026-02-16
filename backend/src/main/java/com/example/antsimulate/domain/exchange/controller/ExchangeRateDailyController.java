package com.example.antsimulate.domain.exchange.controller;

import com.example.antsimulate.domain.exchange.dto.GetLastExchangeRateResponse;
import com.example.antsimulate.domain.exchange.service.ExchangeRateDailyService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/exchange")
@RequiredArgsConstructor
public class ExchangeRateDailyController {
    private final ExchangeRateDailyService exchangeRateDailyService;

    @GetMapping("/latest")
    public ResponseEntity<GetLastExchangeRateResponse> getLastExchangeRate(@RequestParam @NotBlank String baseCurrency,
                                                                           @RequestParam @NotBlank String quoteCurrency){
        GetLastExchangeRateResponse response = exchangeRateDailyService.getLastExchangeRate(baseCurrency, quoteCurrency);
        return ResponseEntity.ok(response);
    }
}
