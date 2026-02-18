package com.example.antsimulate.domain.stock.controller;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.dto.LikeStockItemsResponse;
import com.example.antsimulate.domain.stock.entity.StockItems;
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

    @GetMapping
    public ResponseEntity<?> getStockItems(){
        List<StockItems> response = stockService.getStockItemsList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{stockItemId}")
    public ResponseEntity<?> getStockPriceDaily(@PathVariable Long stockItemId){
        List<GetStockPriceDailyResponse> response = stockService.getStockPriceDailyList(stockItemId);
        return ResponseEntity.ok(response); // 상태코드 200
    }

    @PostMapping("/{userId}/{stockItemId}/like")
    public ResponseEntity<?> createOrDeleteLikeStockItems(@PathVariable Long userId                              
                                                        ,@PathVariable Long stockItemId){
        LikeStockItemsResponse response = stockService.createOrDeleteLikeStockItems(userId, stockItemId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/liked")
    public ResponseEntity<?> getLikedStockItems(@PathVariable Long userId){
        List<StockItems> response = stockService.getLikedStockItems(userId);
        return ResponseEntity.ok(response);
    }
}
