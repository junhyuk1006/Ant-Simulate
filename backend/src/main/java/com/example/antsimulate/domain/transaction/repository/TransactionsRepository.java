package com.example.antsimulate.domain.transaction.repository;

import com.example.antsimulate.domain.transaction.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionsRepository extends JpaRepository<Transactions, Long> {
}
