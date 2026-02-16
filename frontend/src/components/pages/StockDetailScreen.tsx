import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Calendar,
  Loader2,
  Activity,
  Settings2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData, Time, CandlestickSeries, HistogramSeries, LineSeries } from "lightweight-charts";
import { stocksApi } from "@/services/api";
import type { StockItem, StockChartData } from "@/types";
import { useTheme } from "@/hooks";
import { useCurrency } from "@/hooks/useCurrency";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 백엔드/프론트엔드 필드명 호환을 위한 헬퍼 함수
const getStockSymbol = (stock: StockItem): string => stock.stockSymbol || stock.symbol || "";
const getStockName = (stock: StockItem): string => stock.stockName || stock.name || "";

interface StockDetailScreenProps {
  stockItem: StockItem;
  onBack: () => void;
  onToggleLike?: (stockItem: StockItem) => void;
  isLiked?: boolean;
}

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y" | "10Y" | "20Y" | "MAX";
type ChartPeriod = "daily" | "weekly" | "monthly";

export function StockDetailScreen({ 
  stockItem, 
  onBack, 
  onToggleLike,
  isLiked = false 
}: StockDetailScreenProps) {
  const { isDark } = useTheme();
  const { currency, formatPrice, convertPrice } = useCurrency();
  const priceChartContainerRef = useRef<HTMLDivElement>(null);
  const volumeChartContainerRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const maSeriesRefs = useRef<Record<string, ISeriesApi<"Line"> | null>>({});
  
  const [chartData, setChartData] = useState<StockChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  
  // 이동평균선 설정
  const [maSettings, setMaSettings] = useState({
    ma5: { enabled: true, color: "#f59e0b" },
    ma20: { enabled: true, color: "#3b82f6" },
    ma60: { enabled: true, color: "#10b981" },
    ma120: { enabled: false, color: "#8b5cf6" },
    ma200: { enabled: false, color: "#ef4444" },
  });

  // 차트 데이터 로드
  useEffect(() => {
    async function loadChartData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await stocksApi.getStockChart(stockItem.id);
        const sortedData = data.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setChartData(sortedData);
      } catch (err) {
        console.error("Failed to load chart data:", err);
        setError("차트 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    loadChartData();
  }, [stockItem.id]);

  // 일봉 데이터를 주봉/월봉으로 변환
  const periodData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    if (chartPeriod === "daily") return chartData;
    
    const groupedData: Record<string, StockChartData[]> = {};
    
    chartData.forEach(item => {
      const date = new Date(item.date);
      let key: string;
      
      if (chartPeriod === "weekly") {
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        key = monday.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      }
      
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(item);
    });
    
    return Object.entries(groupedData).map(([dateKey, items]) => {
      const sortedItems = items.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      return {
        date: dateKey,
        time: dateKey,
        open: sortedItems[0].open,
        high: Math.max(...items.map(i => i.high)),
        low: Math.min(...items.map(i => i.low)),
        close: sortedItems[sortedItems.length - 1].close,
        price: sortedItems[sortedItems.length - 1].close,
        volume: items.reduce((sum, i) => sum + i.volume, 0)
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData, chartPeriod]);

  // 선택된 기간에 따라 데이터 필터링
  const filteredData = useMemo(() => {
    if (periodData.length === 0) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "1M": startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); break;
      case "3M": startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); break;
      case "6M": startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()); break;
      case "1Y": startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
      case "3Y": startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()); break;
      case "5Y": startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()); break;
      case "10Y": startDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()); break;
      case "20Y": startDate = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate()); break;
      case "MAX": default: return periodData;
    }

    
    // 환율 변환 적용
    const sourceCurrency = stockItem.stockCountry === 'US' ? 'USD' : 'KRW';
    
    // 만약 현재 currency와 원본 화폐가 다르면 값 변환
    if (sourceCurrency !== currency) {
      return periodData.filter(d => new Date(d.date) >= startDate).map(item => ({
        ...item,
        open: convertPrice(item.open, sourceCurrency),
        high: convertPrice(item.high, sourceCurrency),
        low: convertPrice(item.low, sourceCurrency),
        close: convertPrice(item.close, sourceCurrency),
        // volume은 변환 안함
      }));
    }
    
    return periodData.filter(d => new Date(d.date) >= startDate);
  }, [periodData, timeRange, stockItem, currency, convertPrice]);


  // 이동평균 계산
  const calculateMA = (data: StockChartData[], period: number): LineData[] => {
    const result: LineData[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b.close, 0);
      result.push({
        time: data[i].date as Time,
        value: sum / period
      });
    }
    return result;
  };

  // 통계 계산
  const stats = useMemo(() => {
    if (filteredData.length < 2) {
      return { currentPrice: 0, change: 0, changePercent: 0, high: 0, low: 0, avgVolume: 0, periodHigh: 0, periodLow: 0 };
    }
    
    const latest = filteredData[filteredData.length - 1];
    const first = filteredData[0];
    const change = latest.close - first.close;
    const changePercent = (change / first.close) * 100;
    
    const prices = filteredData.map(d => d.close);
    const volumes = filteredData.map(d => d.volume);
    
    return {
      currentPrice: latest.close,
      change,
      changePercent,
      high: latest.high,
      low: latest.low,
      avgVolume: Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length),
      periodHigh: Math.max(...prices),
      periodLow: Math.min(...prices)
    };
  }, [filteredData]);

  const isPositive = stats.changePercent >= 0;

  // 차트 생성 및 업데이트
  useEffect(() => {
    if (!priceChartContainerRef.current || filteredData.length === 0) return;

    // 기존 차트 제거
    if (priceChartRef.current) {
      priceChartRef.current.remove();
      priceChartRef.current = null;
    }
    if (volumeChartRef.current) {
      volumeChartRef.current.remove();
      volumeChartRef.current = null;
    }

    // === 주가 차트 생성 ===
    const priceChart = createChart(priceChartContainerRef.current, {
      width: priceChartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#94a3b8' : '#64748b',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
        horzLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
        horzLine: {
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        scaleMargins: { top: 0.02, bottom: 0.02 },
        minimumWidth: 80, // Y축 너비 고정
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        visible: false, // 거래량 차트에서 시간축 표시
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
    });

    priceChartRef.current = priceChart;

    // 캔들스틱 시리즈
    const candlestickSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderUpColor: '#ef4444',
      borderDownColor: '#3b82f6',
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // 캔들스틱 데이터 설정
    const candleData: CandlestickData[] = filteredData.map(d => ({
      time: d.date as Time,
      // useCurrency hook에서 처리된 데이터가 이미 변환되어 있음
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candlestickSeries.setData(candleData);

    // 이동평균선 시리즈들
    const maConfigs = [
      { key: 'ma5', period: 5, ...maSettings.ma5 },
      { key: 'ma20', period: 20, ...maSettings.ma20 },
      { key: 'ma60', period: 60, ...maSettings.ma60 },
      { key: 'ma120', period: 120, ...maSettings.ma120 },
      { key: 'ma200', period: 200, ...maSettings.ma200 },
    ];

    maConfigs.forEach(({ key, period, enabled, color }) => {
      if (enabled && filteredData.length >= period) {
        const maSeries = priceChart.addSeries(LineSeries, {
          color: color,
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        maSeriesRefs.current[key] = maSeries;
        maSeries.setData(calculateMA(filteredData, period));
      }
    });

    priceChart.timeScale().fitContent();

    // === 거래량 차트 생성 ===
    if (volumeChartContainerRef.current) {
      const volumeChart = createChart(volumeChartContainerRef.current, {
        width: volumeChartContainerRef.current.clientWidth,
        height: 130,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: isDark ? '#94a3b8' : '#64748b',
        },
        grid: {
          vertLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
          horzLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          },
          horzLine: {
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          },
        },
        rightPriceScale: {
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          scaleMargins: { top: 0.15, bottom: 0.05 }, // 상단 여백 늘림
          minimumWidth: 80, // Y축 너비 고정 (주가 차트와 동일)
        },
        timeScale: {
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
      });

      volumeChartRef.current = volumeChart;

      const volumeSeries = volumeChart.addSeries(HistogramSeries, {
        color: '#6366f1',
        priceFormat: { type: 'volume' },
      });
      volumeSeriesRef.current = volumeSeries;

      const volumeData: HistogramData[] = filteredData.map(d => ({
        time: d.date as Time,
        value: d.volume,
        color: d.close >= d.open 
          ? 'rgba(239, 68, 68, 0.6)' 
          : 'rgba(59, 130, 246, 0.6)',
      }));
      volumeSeries.setData(volumeData);

      volumeChart.timeScale().fitContent();

      // 두 차트의 시간축 동기화
      priceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range && volumeChartRef.current) {
          volumeChartRef.current.timeScale().setVisibleLogicalRange(range);
        }
      });

      volumeChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range && priceChartRef.current) {
          priceChartRef.current.timeScale().setVisibleLogicalRange(range);
        }
      });
    }

    // 차트 크기 조정
    const handleResize = () => {
      if (priceChartContainerRef.current && priceChartRef.current) {
        priceChartRef.current.applyOptions({
          width: priceChartContainerRef.current.clientWidth,
        });
      }
      if (volumeChartContainerRef.current && volumeChartRef.current) {
        volumeChartRef.current.applyOptions({
          width: volumeChartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (priceChartRef.current) {
        priceChartRef.current.remove();
        priceChartRef.current = null;
      }
      if (volumeChartRef.current) {
        volumeChartRef.current.remove();
        volumeChartRef.current = null;
      }
    };
  }, [filteredData, isDark, maSettings]);

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: "1개월", value: "1M" },
    { label: "3개월", value: "3M" },
    { label: "6개월", value: "6M" },
    { label: "1년", value: "1Y" },
    { label: "3년", value: "3Y" },
    { label: "5년", value: "5Y" },
    { label: "10년", value: "10Y" },
    { label: "20년", value: "20Y" },
    { label: "전체", value: "MAX" },
  ];

  const chartPeriods: { label: string; value: ChartPeriod }[] = [
    { label: "일봉", value: "daily" },
    { label: "주봉", value: "weekly" },
    { label: "월봉", value: "monthly" },
  ];

  const toggleMA = (key: keyof typeof maSettings) => {
    setMaSettings(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  };

  const handleZoomIn = () => {
    if (priceChartRef.current) {
      const timeScale = priceChartRef.current.timeScale();
      const visibleRange = timeScale.getVisibleLogicalRange();
      if (visibleRange) {
        const newRange = {
          from: visibleRange.from + (visibleRange.to - visibleRange.from) * 0.1,
          to: visibleRange.to - (visibleRange.to - visibleRange.from) * 0.1,
        };
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };

  const handleZoomOut = () => {
    if (priceChartRef.current) {
      const timeScale = priceChartRef.current.timeScale();
      const visibleRange = timeScale.getVisibleLogicalRange();
      if (visibleRange) {
        const newRange = {
          from: visibleRange.from - (visibleRange.to - visibleRange.from) * 0.2,
          to: visibleRange.to + (visibleRange.to - visibleRange.from) * 0.2,
        };
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };

  const handleResetZoom = () => {
    if (priceChartRef.current) {
      priceChartRef.current.timeScale().fitContent();
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}
            className={`rounded-xl ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getStockName(stockItem)}</h1>
              <span className={`text-sm px-2 py-0.5 rounded-lg ${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{getStockSymbol(stockItem)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-lg ${stockItem.stockCountry === 'US' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {stockItem.stockType || (stockItem.stockCountry === 'US' ? 'NASDAQ' : 'KOSPI')}
              </span>
            </div>
            {stockItem.stockAlias && <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{stockItem.stockAlias}</p>}
          </div>
        </div>
        
        {onToggleLike && (
          <Button variant="ghost" size="icon" onClick={() => onToggleLike(stockItem)}
            className={`rounded-xl ${isLiked ? 'text-amber-400' : isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-600 hover:text-amber-500'}`}>
            <Star className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        )}
      </div>

      {/* Price Overview */}
      <Card className={`glass-card rounded-2xl p-6 mb-6`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatPrice(stats.currentPrice, currency)}
              </span>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl ${isPositive ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-semibold">{isPositive ? "+" : ""}{formatPrice(Math.abs(stats.change), currency)} ({isPositive ? "+" : ""}{stats.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>선택 기간 대비 수익률</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-3`}>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>기간 고가</div>
              <div className="text-red-500 font-semibold">{formatPrice(stats.periodHigh, currency)}</div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-3`}>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>기간 저가</div>
              <div className="text-blue-500 font-semibold">{formatPrice(stats.periodLow, currency)}</div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-3`}>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>평균 거래량</div>
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{(stats.avgVolume / 1000000).toFixed(2)}M</div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-3`}>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>데이터 기간</div>
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{filteredData.length}개</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {timeRanges.map((range) => (
            <Button key={range.value} variant="outline" size="sm" onClick={() => setTimeRange(range.value)}
              className={`rounded-lg transition-all ${timeRange === range.value
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30"
                : isDark ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}>
              {range.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {chartPeriods.map((period) => (
              <Button key={period.value} variant="outline" size="sm" onClick={() => setChartPeriod(period.value)}
                className={`rounded-lg transition-all ${chartPeriod === period.value
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                  : isDark ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}>
                {period.label}
              </Button>
            ))}
          </div>

          {/* 줌 컨트롤 */}
          <div className="flex items-center gap-1 ml-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}
              className={`rounded-lg h-8 w-8 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}
              className={`rounded-lg h-8 w-8 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetZoom}
              className={`rounded-lg h-8 w-8 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={`rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                <Activity className="w-4 h-4 mr-2" />지표<Settings2 className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-64 ${isDark ? 'glass-card border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>이동평균선</h4>
                {Object.entries(maSettings).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                      <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{key.toUpperCase()}</Label>
                    </div>
                    <Switch checked={config.enabled} onCheckedChange={() => toggleMA(key as keyof typeof maSettings)} />
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm" /><span className="text-xs text-slate-400">상승</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm" /><span className="text-xs text-slate-400">하락</span></div>
        {maSettings.ma5.enabled && <div className="flex items-center gap-1"><div className="w-4 h-0.5" style={{backgroundColor: maSettings.ma5.color}} /><span className="text-xs text-slate-400">MA5</span></div>}
        {maSettings.ma20.enabled && <div className="flex items-center gap-1"><div className="w-4 h-0.5" style={{backgroundColor: maSettings.ma20.color}} /><span className="text-xs text-slate-400">MA20</span></div>}
        {maSettings.ma60.enabled && <div className="flex items-center gap-1"><div className="w-4 h-0.5" style={{backgroundColor: maSettings.ma60.color}} /><span className="text-xs text-slate-400">MA60</span></div>}
        {maSettings.ma120.enabled && <div className="flex items-center gap-1"><div className="w-4 h-0.5" style={{backgroundColor: maSettings.ma120.color}} /><span className="text-xs text-slate-400">MA120</span></div>}
        {maSettings.ma200.enabled && <div className="flex items-center gap-1"><div className="w-4 h-0.5" style={{backgroundColor: maSettings.ma200.color}} /><span className="text-xs text-slate-400">MA200</span></div>}
      </div>

      {/* Main Chart */}
      <Card className={`glass-card rounded-2xl p-4`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-[550px]">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[550px]">
            <p className="text-rose-400">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[550px]">
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>차트 데이터가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ height: '550px' }}>
            {/* 주가 차트 */}
            <div ref={priceChartContainerRef} className="w-full" style={{ height: '420px' }} />
            
            {/* 구분선 */}
            <div className={`w-full border-t ${isDark ? 'border-white/20' : 'border-black/10'}`} />
            
            {/* 거래량 차트 */}
            <div ref={volumeChartContainerRef} className="w-full" style={{ height: '130px' }} />
          </div>
        )}
        <p className={`text-xs text-center mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          🖱️ 마우스 휠: 확대/축소 | 드래그: 이동
        </p>
      </Card>

      {/* Data Summary */}
      {!isLoading && !error && chartData.length > 0 && (
        <Card className={`glass-card rounded-2xl p-6 mt-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>데이터 요약</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-4`}>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>전체 데이터 기간</div>
              <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {chartData.length > 0 && `${new Date(chartData[0].date).toLocaleDateString('ko-KR')} ~ ${new Date(chartData[chartData.length - 1].date).toLocaleDateString('ko-KR')}`}
              </div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-4`}>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>총 데이터 개수</div>
              <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{chartData.length.toLocaleString()}일 ({(chartData.length / 252).toFixed(1)}년)</div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-xl p-4`}>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>마켓</div>
              <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stockItem.stockCountry === 'US' ? '미국' : '한국'} · {stockItem.stockType || 'STOCK'}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
