package com.example.antsimulate.domain.account.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GetAccountResponse {
    private Long accountId;
    private long startAsset;
    private long totalAsset;
}
