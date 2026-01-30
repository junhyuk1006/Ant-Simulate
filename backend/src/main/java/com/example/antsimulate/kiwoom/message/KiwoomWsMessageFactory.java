package com.example.antsimulate.kiwoom.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class KiwoomWsMessageFactory {
    private final ObjectMapper objectmapper = new ObjectMapper();

    public String buildReg(String symbol){
        Map<String, Object> message = new HashMap<>();
        message.put("action", "REG");
        message.put("symbol", symbol);

        return toJson(message);
    }

    public String buildRemove(String symbol){
        Map<String, Object> message = new HashMap<>();
        message.put("action", "REMOVE");
        message.put("symbol", symbol);

        return toJson(message);
    }

    private String toJson(Map<String, Object> message) {
        try{
            String json = objectmapper.writeValueAsString(message);
            log.debug("Kiwoom WS message created: {}", message);
            return json;
        } catch (JsonProcessingException e){
            log.error("Failed to serialize Kiwoom WS message", e);
            throw new IllegalStateException("Kiwoom WS message serialization failed");
        }
    }
}
