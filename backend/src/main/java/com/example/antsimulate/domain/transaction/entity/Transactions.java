package com.example.antsimulate.domain.transaction.entity;

import com.example.antsimulate.domain.account.entity.Account;
import com.example.antsimulate.domain.stock.entity.StockItems;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "transactions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "account_id")
    private Account account;

    @OneToOne
    @JoinColumn(nullable = false, name = "stock_item_id")
    private StockItems stockItems;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "type")
    private TransactionType transactionType;

    @Column(nullable = false, name="price")
    private int price;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate(){
        this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
}
