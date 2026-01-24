package com.example.antsimulate.domain.portfilio.entity;

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
@Table(name = "portfolio")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "account_id")
    private Account account;

    @OneToOne
    @JoinColumn(nullable = false, name = "stock_item_id")
    private StockItems stockItems;

    @Column(nullable = false, name = "total_quantity")
    private int totalQuantity;

    @Column(nullable = false, name = "avg_price")
    private int avgPrice;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @Column(nullable = false, name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate(){
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate(){
        this.updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }

}
