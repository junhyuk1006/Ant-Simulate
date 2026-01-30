package com.example.antsimulate.stockhistory.batch;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DailyBatchController {
    private final DailyBatchService dailyBatchService;

    // 추후 PostMapping으로 변경, 초반 적재시에만 GetMapping 유지
    // @PostMapping("/debug/batch/daily")
    @GetMapping("/debug/batch/daily")
    public String runDaily(){
        dailyBatchService.runDailyBatch();
        return "daily batch started";
    }
}
