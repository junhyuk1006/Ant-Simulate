package com.example.antsimulate.domain.account.controller;

import com.example.antsimulate.domain.account.dto.GetAccountResponse;
import com.example.antsimulate.domain.account.dto.UpdateStartAssetRequest;
import com.example.antsimulate.domain.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getAccount(@PathVariable Long userId){
        GetAccountResponse response = accountService.getAccount(userId);
        return ResponseEntity.ok(response); // 상태코드 200
    }

    @PatchMapping("/{accountId}/update-start-asset")
    public ResponseEntity<?> updateStartAsset(@PathVariable Long accountId,
                                              @RequestBody UpdateStartAssetRequest request){
        accountService.updateStartAsset(accountId, request.getStartAsset());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{accountId}/reset-asset")
    public ResponseEntity<?> resetAsset(@PathVariable Long accountId){
        accountService.resetAsset(accountId);
        return ResponseEntity.noContent().build();
    }

}
