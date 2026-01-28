package com.example.antsimulate.domain.stock.service;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.dto.LikeStockItemsResponse;
import com.example.antsimulate.domain.stock.entity.LikeStockItems;
import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.repository.LikeStockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockPriceDailyRepository;
import com.example.antsimulate.domain.user.entity.User;
import com.example.antsimulate.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockPriceDailyRepository stockPriceDailyRepository;
    private final LikeStockItemsRepository likeStockItemsRepository;
    private final StockItemsRepository stockItemsRepository;
    private final UserRepository userRepository;

    /**
     *  종목별 차트 조회
     **/
    public List<GetStockPriceDailyResponse> getStockPriceDaily(Long stockItemId){
        return stockPriceDailyRepository.findDailyPrices(stockItemId);
    }

    /**
     *  관심종목 추가 및 삭제
     **/
    public LikeStockItemsResponse createOrDeleteLikeStockItems(Long userId, Long stockItemId){
        User user = userRepository.getReferenceById(userId);
        StockItems stockItems = stockItemsRepository.getReferenceById(stockItemId);

        int count = likeStockItemsRepository.deleteByUserIdAndStockItemsId(userId, stockItemId);
        if(count == 0){
            LikeStockItems likeStockItems = LikeStockItems
                                                .builder()
                                                .user(user)
                                                .stockItems(stockItems)
                                                .build();
            
            likeStockItemsRepository.save(likeStockItems);
            return new LikeStockItemsResponse("create");
        }

        return new LikeStockItemsResponse("delete");
    }
}
