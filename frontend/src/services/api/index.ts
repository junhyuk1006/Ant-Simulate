/**
 * API 서비스 모듈 통합 export
 * 
 * 사용 예시:
 * ```ts
 * import { authApi, stocksApi, accountApi, backtestApi } from '@/services/api';
 * 
 * // 로그인
 * const result = await authApi.login({ email, password });
 * 
 * // 주식 목록 조회
 * const stocks = await stocksApi.getStockItems();
 * 
 * // 계좌 조회
 * const account = await accountApi.getAccount(userId);
 * ```
 */

// API 클라이언트
export { apiClient, ApiError, setAccessToken, removeAccessToken } from "./client";

// 인증 API
export * as authApi from "./auth";

// 주식 API
export * as stocksApi from "./stocks";

// 계좌 API
export * as accountApi from "./account";

// 백테스팅 API
export * as backtestApi from "./backtest";

// 포트폴리오 API
export * as portfolioApi from "./portfolio";

// 주문 API
export * as ordersApi from "./orders";

// 사용자 API
export * as userApi from "./user";

// 환율 API
export * as exchangeApi from "./exchange";
