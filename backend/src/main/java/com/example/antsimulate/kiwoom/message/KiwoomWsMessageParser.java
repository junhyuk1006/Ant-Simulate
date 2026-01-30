package com.example.antsimulate.kiwoom.message;

import com.example.antsimulate.kiwoom.dto.KiwoomQuoteDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KiwoomWsMessageParser {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 키움 WebSocket 원본 메시지를 받아 내부 DTO로 변환
     */
    public KiwoomQuoteDto parse(String raw){
        try{
            JsonNode root = objectMapper.readTree(raw);

            KiwoomQuoteDto dto = new KiwoomQuoteDto();
            dto.setSymbol(root.path("symbol").asText(null));
            dto.setPrice(root.path("price").asLong());
            dto.setTime(root.path("time").asText(null));
            return dto;
        } catch (Exception e){
            log.warn("[KIWOOM-WS] parse failed. raw={}", raw, e);
            return null;
        }
    }
}
