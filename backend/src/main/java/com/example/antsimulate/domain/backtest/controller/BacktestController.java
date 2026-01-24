package com.example.antsimulate.domain.backtest.controller;

import com.example.antsimulate.domain.backtest.dto.BacktestRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BacktestController {

    @PostMapping("/backtest")
    public ResponseEntity<?> runBacktest(@RequestBody @Valid BacktestRequest request) {
        return ResponseEntity.ok().build();
    }
}
