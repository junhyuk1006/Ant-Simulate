package com.example.antsimulate.stockhistory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class StockApiClientConfig {

    @Bean
    public RestClient twelveDataRestClient(@Value("${twelvedata.base-url}") String baseUrl){
        return RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
