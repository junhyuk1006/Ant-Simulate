package com.example.antsimulate.kiwoom.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class SubscriptionService {
    private final ConcurrentHashMap<String, AtomicInteger> refCountBySymbol = new ConcurrentHashMap<>();

    /**
     * 종목 구독을 증가시키고 이번 호출이 최초 구독인지 여부를 반환
     **/
    public boolean subscribe(String symbol){
        AtomicInteger counter = refCountBySymbol.computeIfAbsent(symbol, k -> new AtomicInteger(0));
        int after = counter.incrementAndGet();

        if(after == 1){
            log.info("subscribe first -> REG needed. symbol={}", symbol);
            return true;
        }

        log.debug("subscribe -> no REG. symbol={}, refCount={}", symbol, after);
        return false;
    }

    /**
     * 종목 구독을 감소시키고 이번 호출이 마지막 구독 해제인지 여부를 반환
     **/
    public boolean unsubscribe(String symbol){
        AtomicInteger counter = refCountBySymbol.get(symbol);
        if(counter == null) {
            log.debug("unsubscribe ignored (no counter). symbol={}", symbol);
            return false;
        }

        int after = counter.decrementAndGet();

        if(after == 0){
            refCountBySymbol.remove(symbol);
            log.info("unsubscribe last -> REMOVE needed. symbol={}", symbol);
            return true;
        }

        if(after < 0) {
            refCountBySymbol.remove(symbol);
            log.warn("unsubscribe underflow -> force remove. symbol={}, refCount={}", symbol, after);
            return true;
        }

        log.debug("unsubscreive -> no REMOVE. symbol={}, refCount={}", symbol, after);
        return false;
    }
}
