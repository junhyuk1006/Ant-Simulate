package com.example.antsimulate.kiwoom.service;

import com.example.antsimulate.kiwoom.dto.KiwoomQuoteDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuoteBroadcastService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void broadcast(KiwoomQuoteDto dto){
        String symbol = dto.getSymbol();
        if(symbol == null || symbol.isBlank()) {
            log.debug("[QUOTE] skip broadcast (no symbol)");
            return;
        }

        String destination = "/topic/" + symbol;
        simpMessagingTemplate.convertAndSend(destination, dto);
        log.debug("[QUOTE] broadcast destination={}, dto={}", destination, dto);
    }
}
