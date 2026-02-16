import { apiClient } from "./client";

export interface ExchangeRateResponse {
  rateDate: string;
  rate: number;
}

export const getLatestExchangeRate = async (
  baseCurrency: string = "USD",
  quoteCurrency: string = "KRW"
): Promise<ExchangeRateResponse> => {
  try {
    const query = new URLSearchParams({
      baseCurrency,
      quoteCurrency,
    }).toString();
    
    // apiClient.get returns { success: boolean, data: T }
    const response = await apiClient.get<ExchangeRateResponse>(
      `/exchange/latest?${query}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    // Return a fallback just in case, though the hook handles errors too
    return {
      rateDate: new Date().toISOString().split('T')[0],
      rate: 1400 // Safe fallback
    };
  }
};
