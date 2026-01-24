package com.example.antsimulate.domain.backtest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BacktestResponse(
        @JsonProperty("total_return_pct")
        double totalReturnPct,   // 총 수익률 %

        @JsonProperty("mdd_pct")
        double mddPct,           // 최대 낙폭 %

        @JsonProperty("sharpe_ratio")
        double sharpeRatio,      // 샤프 지수

        @JsonProperty("final_assets")
        double finalAssets,      // 최종 자산

        @JsonProperty("total_trades")
        int totalTrades,         // 총 거래 횟수

        @JsonProperty("win_rate")
        double winRate           // 승률
) {
    public boolean isProfitable() {
        return totalReturnPct > 0;
    }
}
