package com.example.antsimulate.global.runner;

import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.repository.StockItemsRepository;
import com.example.antsimulate.domain.stock.service.AlphaStockPriceIngestService;
import com.example.antsimulate.domain.stock.service.YahooStockPriceIngestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class IngestRunner implements CommandLineRunner {
    private final AlphaStockPriceIngestService ingestService;
    private final YahooStockPriceIngestService yahooStockPriceIngestService;
    private final StockItemsRepository stockItemsRepository;

    @Override
    public void run(String... args) throws Exception {
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(100);

        List<StockItems> items = stockItemsRepository.findAll();

        for (StockItems item : items){

            if (!item.getStockSymbol().matches("^[A-Z.]{1,5}$")) {
                log.info("skip non-alpha symbol: {}", item.getStockSymbol());
                continue;
            }

            try{
                log.info("▶ ingest start: {}", item.getStockSymbol());
                ingestService.ingestDailyPrices(item.getStockSymbol());
                Thread.sleep(15_000);
                log.info("✔ ingest success: {}", item.getStockSymbol());
            } catch (Exception e){
                log.warn("✖ ingest fail: {}", item.getStockSymbol(), e);
            }
        }
    }

    /*@Override
    public void run(String... args) {
        LocalDate from = LocalDate.of(2000, 1, 1);
        LocalDate to = LocalDate.now();

        List<StockItems> items = stockItemsRepository.findAll();

        for (StockItems item : items) {
            try {
                yahooStockPriceIngestService.ingestDailyPrices(
                        item.getStockSymbol(), from, to
                );
                Thread.sleep(500);
            } catch (Exception e) {
                throw new IllegalArgumentException("");
            }
        }
    }*/
}
