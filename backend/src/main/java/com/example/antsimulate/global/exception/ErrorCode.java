package com.example.antsimulate.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다."),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다."),
    PASSWORD_NOT_CHANGE(HttpStatus.BAD_REQUEST, "비밀번호가 기존과 동일합니다."),

    // Account
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "계좌를 찾을 수 없습니다."),
    INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "잔고가 부족합니다."),
    // StockItems
    STOCK_ITEMS_NOT_FOUND(HttpStatus.NOT_FOUND, "종목 정보를 찾을 수 없습니다."),

    // StockPriceDaily
    STOCK_PRICE_DAILY_DESC1_NOT_FOUND(HttpStatus.NOT_FOUND, "최근 가격 데이터를 찾을 수 없습니다."),

    // ExchangeRateDaily
    EXCHANGE_RATE_NOT_FOUND(HttpStatus.NOT_FOUND, "환율정보를 찾을 수 없습니다."),

    // Backtest
    BACKTEST_API_ERROR(HttpStatus.BAD_GATEWAY, "백테스트 서버 통신 중 오류가 발생했습니다."),

    // Infra
    KIWOOM_TOKEN_ISSUE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "키움 access token 발급에 실패했습니다."),
    KIWOOM_WS_SERIALIZATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "키움 웹소켓 메시지 직렬화에 실패했습니다."),
    EXTERNAL_DATA_RESPONSE_ERROR(HttpStatus.BAD_GATEWAY, "외부 데이터 응답 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
