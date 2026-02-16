import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { exchangeApi } from '@/services/api';

type Currency = 'KRW' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  exchangeRate: number;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, sourceCurrency?: Currency) => number;
  formatPrice: (price: number, sourceCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // 기본값: KRW
  const [currency, setCurrencyState] = useState<Currency>('KRW');
  const [exchangeRate, setExchangeRate] = useState<number>(1400); // 초기값 (안전빵)

  // 환율 가져오기
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const data = await exchangeApi.getLatestExchangeRate('USD', 'KRW');
        if (data && data.rate) {
          setExchangeRate(data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };
    
    fetchRate();
    // 10분마다 갱신? 아니면 한 번만? 일단 한 번만.
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState(prev => prev === 'KRW' ? 'USD' : 'KRW');
  }, []);

  /**
   * 가격 변환 함수
   * @param price 원래 가격 (기본적으로 KRW라고 가정하거나, sourceCurrency로 명시)
   * @param sourceCurrency 원래 가격의 통화 (기본값: KRW)
   * @returns 현재 선택된 통화(currency)로 변환된 가격
   */
  const convertPrice = useCallback((price: number, sourceCurrency: Currency = 'KRW') => {
    // 1. 먼저 KRW로 통일
    let priceInKRW = price;
    if (sourceCurrency === 'USD') {
      priceInKRW = price * exchangeRate;
    }

    // 2. 목표 통화로 변환
    if (currency === 'KRW') {
      return priceInKRW;
    } else {
      return priceInKRW / exchangeRate;
    }
  }, [currency, exchangeRate]);

  /**
   * 가격 포맷팅 함수 (심볼 포함)
   */
  const formatPrice = useCallback((price: number, sourceCurrency: Currency = 'KRW') => {
    const converted = convertPrice(price, sourceCurrency);
    
    if (currency === 'USD') {
      return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // 원화는 소수점 버림
      return `₩${Math.round(converted).toLocaleString()}`;
    }
  }, [currency, convertPrice]);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      toggleCurrency, 
      exchangeRate, 
      setCurrency, 
      convertPrice, 
      formatPrice 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
