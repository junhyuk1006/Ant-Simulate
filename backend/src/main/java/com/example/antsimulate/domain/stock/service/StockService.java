package com.example.antsimulate.domain.stock.service;

import com.example.antsimulate.domain.stock.dto.GetStockPriceDailyResponse;
import com.example.antsimulate.domain.stock.dto.LikeStockItemsResponse;
import com.example.antsimulate.domain.stock.entity.LikeStockItems;
import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import com.example.antsimulate.domain.stock.repository.LikeStockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockItemsRepository;
import com.example.antsimulate.domain.stock.repository.StockPriceDailyRepository;
import com.example.antsimulate.domain.user.entity.User;
import com.example.antsimulate.domain.user.repository.UserRepository;
import com.example.antsimulate.global.exception.BusinessException;
import com.example.antsimulate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockPriceDailyRepository stockPriceDailyRepository;
    private final LikeStockItemsRepository likeStockItemsRepository;
    private final StockItemsRepository stockItemsRepository;
    private final UserRepository userRepository;

    /**
     * 종목 정보 조회
     */
    public StockItems getStockItems(Long stockItemId){
        return stockItemsRepository.findById(stockItemId).orElseThrow(() -> new BusinessException(ErrorCode.STOCK_ITEMS_NOT_FOUND));
    }

    /**
     *  종목(일봉 데이터) 조회
     **/
    public StockPriceDaily getStockPriceDaily(Long stockItemId){
        return stockPriceDailyRepository.findTop1ByStockItems_IdOrderByTradeDateDesc(stockItemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STOCK_PRICE_DAILY_DESC1_NOT_FOUND));
    }

    /**
     *  차트 리스트 조회
     **/
    public List<StockItems> getStockItemsList(){
        return stockItemsRepository.findAll();
    }

    /**
     *  종목별 차트 조회
     **/
    public List<GetStockPriceDailyResponse> getStockPriceDailyList(Long stockItemId){
        return stockPriceDailyRepository.findDailyPricesList(stockItemId);
    }

    /**
     *  관심종목 추가 및 삭제
     **/
    @Transactional
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

    /**
     *  관심종목 목록 조회
     **/
    public List<StockItems> getLikedStockItems(Long userId){
        return likeStockItemsRepository.findByUserId(userId)
                .stream()
                .map(LikeStockItems::getStockItems)
                .toList();
    }
}
