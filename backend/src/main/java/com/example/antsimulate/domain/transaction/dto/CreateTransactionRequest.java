package com.example.antsimulate.domain.transaction.dto;

import com.example.antsimulate.domain.transaction.entity.TransactionType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateTransactionRequest {
    private TransactionType transactionType;
    private int quantity;
}
