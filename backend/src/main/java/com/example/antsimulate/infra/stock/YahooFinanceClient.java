package com.example.antsimulate.infra.stock;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class YahooFinanceClient {
    private final RestClient yahooRestClient;

    public YahooFinanceClient(@Qualifier("yahooFinanceRestClient") RestClient yahooRestClient) {
        this.yahooRestClient = yahooRestClient;
    }
    public String fetchDailyChartJson(String symbol, long period1, long period2) {
        return yahooRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v8/finance/chart/{symbol}")
                        .queryParam("interval", "1d")
                        .queryParam("period1", period1)
                        .queryParam("period2", period2)
                        .queryParam("events", "div%7Csplit") // div|split
                        .build(symbol)
                )
                .retrieve()
                .body(String.class);
    }

}
