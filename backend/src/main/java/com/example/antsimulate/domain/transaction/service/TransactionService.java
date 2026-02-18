package com.example.antsimulate.domain.transaction.service;

import com.example.antsimulate.domain.account.entity.Account;
import com.example.antsimulate.domain.account.repository.AccountRepository;
import com.example.antsimulate.domain.account.service.AccountService;
import com.example.antsimulate.domain.exchange.service.ExchangeRateDailyService;
import com.example.antsimulate.domain.stock.entity.StockItems;
import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import com.example.antsimulate.domain.stock.service.StockService;
import com.example.antsimulate.domain.transaction.entity.TransactionType;
import com.example.antsimulate.domain.transaction.entity.Transactions;
import com.example.antsimulate.domain.transaction.repository.TransactionsRepository;
import com.example.antsimulate.global.exception.BusinessException;
import com.example.antsimulate.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final StockService stockService;
    private final ExchangeRateDailyService exchangeRateDailyService;
    private final AccountRepository accountRepository;
    private final TransactionsRepository transactionsRepository;

    /**
     * 거래내역 조회
     */
    public void getTransactionList(Long userId){

    }

    /**
     * 매수, 매도
     */
    // 시장가 or 지정가 같은 조건을 건다? 실시간 거래가 의미가 없어진 이상 의미가 있나?
    // 1단계: 전날 종가 즉시 체결만으로 완성
    // 2단계: 추후에 업그레이드 버전으로 실시간 거래 기능 추가 하면 시장가, 지정가, 호가를 생각해서 로직 수정
    @Transactional
    public void createTransaction(Long userId, Long stockItemId, TransactionType transactionType, int quantity){
        Account account = accountRepository.findByUserId(userId).orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
        StockPriceDaily stockPriceDaily = stockService.getStockPriceDaily(stockItemId);
        StockItems stockItems = stockService.getStockItems(stockItemId);

        int price = 0;
        int totalPrice = 0;
        BigDecimal rate = null;
        BigDecimal closePrice = stockPriceDaily.getClosePrice();

        if("US".equals(stockItems.getStockCountry())){
            rate = exchangeRateDailyService.getLastExchangeRate("US", "KR").getRate();
            price = rate.multiply(closePrice)
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValueExact();

            totalPrice = rate.multiply(closePrice)
                    .multiply(new BigDecimal(quantity))
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValueExact();

        }else if("KR".equals(stockItems.getStockCountry())){
            price = stockPriceDaily.getClosePrice().intValueExact();
            totalPrice = price * quantity;
        }

        if(transactionType == TransactionType.BUY){
            account.buy(totalPrice);
        }else if(transactionType == TransactionType.SELL){
            account.sell(totalPrice);
        }

        Transactions transactions = Transactions.builder()
                .account(account)
                .stockItems(stockItems)
                .transactionType(transactionType)
                .price(price)
                .quantity(quantity)
                .exchangeRate(rate)
                .build();

        transactionsRepository.save(transactions);
    }

}
