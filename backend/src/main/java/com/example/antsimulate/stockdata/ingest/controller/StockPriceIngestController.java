package com.example.antsimulate.stockdata.ingest.controller;

import com.example.antsimulate.stockdata.ingest.service.StockPriceDailyIngestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StockPriceIngestController {
    private final StockPriceDailyIngestService stockPriceDailyIngestService;

    @PostMapping("/debug/ingest/daily")
    public String ingest(@RequestParam long stockItemId,
                         @RequestParam String symbol,
                         @RequestParam(defaultValue = "10") int outputsize){
        int attempted = stockPriceDailyIngestService.ingestDailyBySymbol(stockItemId, symbol, outputsize);
        return "attempted rows=" + attempted;
    }
}
