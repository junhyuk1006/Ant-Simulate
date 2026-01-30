package com.example.antsimulate.kiwoom.runner;

import com.example.antsimulate.kiwoom.client.KiwoomWsClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KiwoomWsStarter implements ApplicationRunner {
    private final KiwoomWsClient kiwoomWsClient;

    @Override
    public void run(ApplicationArguments args){
        log.info("[BOOT] start Kiwoom WebSocket");
        kiwoomWsClient.connect();
    }
}
