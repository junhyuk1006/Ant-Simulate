package com.example.antsimulate.domain.account.service;

import com.example.antsimulate.domain.account.dto.GetAccountResponse;
import com.example.antsimulate.domain.account.entity.Account;
import com.example.antsimulate.domain.account.repository.AccountRepository;
import com.example.antsimulate.domain.user.entity.User;
import com.example.antsimulate.domain.user.repository.UserRepository;
import com.example.antsimulate.global.exception.AccountNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {
    private static final long DEFAULT_START_ASSET = 10_000_000L;

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    /**
     *  계좌 조회
     **/
    public GetAccountResponse getAccount(Long userId){
        Account account = accountRepository.findById(userId).orElseThrow(AccountNotFoundException::new);
        return new GetAccountResponse(account.getId(), account.getStartAsset(), account.getTotalAsset());
    }

    /**
     *  계좌 생성
     **/
    public void createAccount(Long userId){
        User user = userRepository.getReferenceById(userId);

        Account account = Account.builder().user(user).startAsset(DEFAULT_START_ASSET).totalAsset(DEFAULT_START_ASSET).build();
        accountRepository.save(account);
    }

    /**
     *  시드머니 변경
     **/
    public void updateStartAsset(Long accountId, long startAsset){
        Account account = accountRepository.findById(accountId).orElseThrow(AccountNotFoundException::new);
        account.setStartAsset(startAsset);
        account.setTotalAsset(startAsset);
    }

    /**
     *  계좌 초기화
     **/
    public void resetAsset(Long accountId){
        Account account = accountRepository.findById(accountId).orElseThrow(AccountNotFoundException::new);
        account.setStartAsset(DEFAULT_START_ASSET);
        account.setTotalAsset(DEFAULT_START_ASSET);
    }
}
