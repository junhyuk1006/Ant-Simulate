package com.example.antsimulate.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class StockApiClientConfig {
    @Bean
    public RestClient alphaVantageRestClient(){
        return RestClient.builder()
                .baseUrl("https://www.alphavantage.co")
                .build();
    }

    @Bean
    public RestClient yahooFinanceRestClient() {
        return RestClient.builder()
                .baseUrl("https://query1.finance.yahoo.com")
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
