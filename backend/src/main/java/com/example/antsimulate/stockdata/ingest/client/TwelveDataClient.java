package com.example.antsimulate.stockdata.ingest.client;

import com.example.antsimulate.stockdata.ingest.dto.TwelveTimeSeriesResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TwelveDataClient {
    private final RestClient restClient;
    private final String apiKey;

    public TwelveDataClient(RestClient twelveDataRestClient,
                            @Value("${twelvedata.api-key}") String apiKey) {
        this.restClient = twelveDataRestClient;
        this.apiKey = apiKey;
    }

    public TwelveTimeSeriesResponse fetchDailySeriesRaw(String symbol, int outputsize){
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/time_series")
                        .queryParam("symbol", symbol)
                        .queryParam("interval", "1day")
                        .queryParam("outputsize", outputsize)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .body(TwelveTimeSeriesResponse.class);
    }
}
