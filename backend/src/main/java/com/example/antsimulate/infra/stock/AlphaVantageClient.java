package com.example.antsimulate.infra.stock;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AlphaVantageClient {
    private final RestClient restClient;

    public AlphaVantageClient(@Qualifier("alphaVantageRestClient") RestClient restClient){
        this.restClient = restClient;
    }

    public String fetchDailyFull(String symbol, String apiKey){
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", "TIME_SERIES_DAILY")
                        .queryParam("symbol", symbol)
                        .queryParam("outputsize", "compact")
                        .queryParam("apikey",apiKey)
                        .build())
                .retrieve()
                .body(String.class);
    }
}
