package com.example.antsimulate.domain.backtest.dto;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import jakarta.validation.constraints.*;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.lang.annotation.*;
import java.time.LocalDate;

@Builder
@BacktestRequest.ValidOrderConfig
public record BacktestRequest(
        @NotBlank String ticker,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull Interval interval,

        @DecimalMin(value = "1000.0")
        double initialCapital,

        double commissionRate,
        double stopLossPct,

        @NotNull StrategyType strategyType,
        @NotNull OrderType orderType,

        Integer divisionCount
) {

    public enum Interval {
        @JsonProperty("1m") M1, @JsonProperty("5m") M5, @JsonProperty("15m") M15,
        @JsonProperty("30m") M30, @JsonProperty("1h") H1, @JsonProperty("1d") D1
    }

    public enum StrategyType {
        @JsonProperty("aggressive") AGGRESSIVE,
        @JsonProperty("defensive") DEFENSIVE
    }

    public enum OrderType {
        BATCH, DIVIDED
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = OrderConfigValidator.class)
    @Documented
    public @interface ValidOrderConfig {
        String message() default "DIVIDED 타입일 경우 divisionCount는 1 이상이어야 합니다.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class OrderConfigValidator implements ConstraintValidator<ValidOrderConfig, BacktestRequest> {
        @Override
        public boolean isValid(BacktestRequest value, ConstraintValidatorContext context) {
            if (value == null) return true;

            if (value.orderType() == OrderType.DIVIDED) {
                return value.divisionCount() != null && value.divisionCount() >= 1;
            }

            return true;
        }
    }
}
