package com.example.antsimulate.domain.stock.controller;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.dto.LikeStockItemsResponse;
import com.example.antsimulate.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {
    private final StockService stockService;

    @GetMapping("/{stockItemId}")
    public ResponseEntity<?> getStockPriceDaily(@PathVariable Long stockItemId){
        List<GetStockPriceDailyResponse> response = stockService.getStockPriceDaily(stockItemId);
        return ResponseEntity.ok(response); // 상태코드 200
    }

    @PostMapping("/{userId}/{stockItemId}/like")
    public ResponseEntity<?> createOrDeleteLikeStockItems(@PathVariable Long userId                              
                                                        ,@PathVariable Long stockItemId){
        LikeStockItemsResponse response = stockService.createOrDeleteLikeStockItems(userId, stockItemId);
        return ResponseEntity.ok(response);
    }
}
