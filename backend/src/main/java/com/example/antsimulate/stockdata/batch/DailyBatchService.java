package com.example.antsimulate.stockdata.batch;

import com.example.antsimulate.stockdata.ingest.service.StockPriceDailyIngestService;
import com.example.antsimulate.stockdata.ingest.repository.StockItemQueryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyBatchService {
    private static final Logger log = LoggerFactory.getLogger(DailyBatchService.class);

    private final StockItemQueryRepository stockItemQueryRepository;
    private final StockPriceDailyIngestService stockPriceDailyIngestService;
    private final SimpleRateLimiter simpleRateLimiter = new SimpleRateLimiter();

    public void runDailyBatch(){
        List<StockItemQueryRepository.StockITemRows> targets = stockItemQueryRepository.findTodayTargets(600);
        log.info("배치 start. count={}", targets.size());

        for(StockItemQueryRepository.StockITemRows item : targets){
            try{
                // 10초 대기(레이트 리밋 보호)
                simpleRateLimiter.acquire();

                // API 호출 및 DB 적재
                int attempted = stockPriceDailyIngestService.ingestDailyBySymbol(
                        item.id(),
                        item.symbol(),
                        5000 // 가져올 갯수(사실상 전체 히스토리)
                );

                log.info("성공: stockItemId={}, symbol={}, attemptedRows={}",
                        item.id(), item.symbol(), attempted);
            } catch (Exception e){
                // 실패시 중단 x, 로그만
                log.error(
                        "실패. stockItemId={}, symbol={}",
                        item.id(), item.symbol(), e
                );
            }
        }
        log.info("Daily batch finished.");
    }
}
