package com.example.antsimulate.kiwoom.controller;

import com.example.antsimulate.kiwoom.client.KiwoomWsClient;
import com.example.antsimulate.kiwoom.message.KiwoomWsMessageFactory;
import com.example.antsimulate.kiwoom.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscription")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final KiwoomWsClient kiwoomWsClient;
    private final KiwoomWsMessageFactory kiwoomWsMessageFactory;

    @PostMapping("/{symbol}")
    public ResponseEntity<Void> subscribe(@PathVariable String symbol){
        boolean regNeeded = subscriptionService.subscribe(symbol);

        if(regNeeded){
            String regMessage = kiwoomWsMessageFactory.buildReg(symbol);
            kiwoomWsClient.send(regMessage);
            log.info("REG sent. symbol={}", symbol);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<Void> unsubscribe(@PathVariable String symbol){
        boolean removeNeeded = subscriptionService.unsubscribe(symbol);

        if(removeNeeded){
            String removeMessage = kiwoomWsMessageFactory.buildRemove(symbol);
            kiwoomWsClient.send(removeMessage);
            log.info("REMOVE sent. symbol={}", symbol);
        }
        return ResponseEntity.ok().build();
    }
}
