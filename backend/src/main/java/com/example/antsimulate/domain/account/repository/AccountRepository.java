package com.example.antsimulate.domain.account.repository;

import com.example.antsimulate.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
