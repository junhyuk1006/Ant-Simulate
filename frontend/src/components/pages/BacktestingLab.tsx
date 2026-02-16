import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, TrendingUp, Play, Sparkles, Target, Calendar, Coins, ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { runBacktest } from "@/services/api/backtest";
import * as stocksApi from "@/services/api/stocks";
import type { BacktestRequest, BacktestResult, StockItem, BacktestStrategyType, BacktestOrderType } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";

// 백엔드/프론트엔드 필드명 호환을 위한 헬퍼 함수
const getStockSymbol = (stock: StockItem): string => stock.stockSymbol || stock.symbol || "";
const getStockName = (stock: StockItem): string => stock.stockName || stock.name || "";

export function BacktestingLab() {
  const { formatPrice, currency } = useCurrency();
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [splitCount, setSplitCount] = useState([5]);
  
  // 백테스트 결과
  const [result, setResult] = useState<BacktestResult | null>(null);
  
  // 종목 검색
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [showStockList, setShowStockList] = useState(false);
  
  // 폼 상태
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [initialCapital, setInitialCapital] = useState(10000000);
  const [commissionRate, setCommissionRate] = useState(0.00015);
  const [stopLossPct, setStopLossPct] = useState(10);
  const [strategyType, setStrategyType] = useState<BacktestStrategyType>("defensive");
  const [orderType, setOrderType] = useState<BacktestOrderType>("DIVIDED");
  
  // 종목 목록 로드
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await stocksApi.getStockItems();
        setStocks(data);
      } catch (error) {
        console.error("종목 로드 실패:", error);
      }
    };
    loadStocks();
  }, []);
  
  // 종목 검색 필터
  const filteredStocks = Array.isArray(stocks) ? stocks.filter(stock => 
    getStockName(stock).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getStockSymbol(stock).toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10) : [];
  
  // 백테스트 실행
  const handleRunBacktest = async () => {
    if (!selectedStock) {
      alert("종목을 선택해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const request: BacktestRequest = {
        ticker: getStockSymbol(selectedStock),
        startDate,
        endDate,
        interval: "1d",
        initialCapital,
        commissionRate,
        stopLossPct,
        strategyType,
        orderType,
        divisionCount: orderType === "DIVIDED" ? splitCount[0] : undefined,
      };
      
      const response = await runBacktest(request);
      setResult(response);
      setShowResults(true);
    } catch (error) {
      console.error("백테스트 실행 실패:", error);
      alert("백테스트 실행에 실패했습니다. 서버 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 모의 차트 데이터 생성 (결과가 있을 때)
  const mockChartData = result ? [
    { date: "시작", strategy: 100, benchmark: 100 },
    { date: "1/4", strategy: 100 + (result.totalReturnPct * 0.25), benchmark: 100 + (result.totalReturnPct * 0.15) },
    { date: "2/4", strategy: 100 + (result.totalReturnPct * 0.5), benchmark: 100 + (result.totalReturnPct * 0.35) },
    { date: "3/4", strategy: 100 + (result.totalReturnPct * 0.7), benchmark: 100 + (result.totalReturnPct * 0.6) },
    { date: "종료", strategy: 100 + result.totalReturnPct, benchmark: 100 + (result.totalReturnPct * 0.6) },
  ] : [];

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <Tabs defaultValue="settings" value={showResults ? "results" : "settings"} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">백테스팅 랩</h2>
            <p className="text-slate-400 text-sm">과거 데이터로 투자 전략을 검증하세요</p>
          </div>
          <TabsList className="bg-white/5 rounded-xl p-1">
            <TabsTrigger 
              value="settings" 
              onClick={() => setShowResults(false)}
              className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
            >
              전략 설정
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={!showResults}
              className="rounded-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
            >
              결과 리포트
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Settings */}
            <Card className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">대상 설정</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2 relative">
                  <Label className="text-slate-300 text-sm">종목 검색</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      placeholder="종목명 또는 종목코드 입력"
                      value={selectedStock ? `${getStockName(selectedStock)} (${getStockSymbol(selectedStock)})` : searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedStock(null);
                        setShowStockList(true);
                      }}
                      onFocus={() => setShowStockList(true)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11"
                    />
                  </div>
                  {showStockList && filteredStocks.length > 0 && !selectedStock && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredStocks.map((stock) => (
                        <button
                          key={stock.id}
                          onClick={() => {
                            setSelectedStock(stock);
                            setSearchQuery("");
                            setShowStockList(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 flex justify-between items-center"
                        >
                          <span className="text-white">{getStockName(stock)}</span>
                          <span className="text-slate-400 text-sm">{getStockSymbol(stock)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      시작일
                    </Label>
                    <Input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      종료일
                    </Label>
                    <Input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-slate-500" />
                    초기 투자금 ({currency === 'KRW' ? '₩' : '$'})
                  </Label>
                  <Input 
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    placeholder="초기 투자 금액을 입력하세요"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formatPrice(initialCapital, currency)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Cost Settings */}
            <Card className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">비용 설정</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">증권사 수수료 (%)</Label>
                  <Input 
                    type="number"
                    value={commissionRate * 100}
                    onChange={(e) => setCommissionRate(Number(e.target.value) / 100)}
                    step="0.001"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">손절률 (%)</Label>
                  <Input 
                    type="number"
                    value={stopLossPct}
                    onChange={(e) => setStopLossPct(Number(e.target.value))}
                    step="1"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-300 text-sm">
                    💡 비용을 정확히 설정하면 더 현실적인 수익률을 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Strategy Settings */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">전략 설정</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">주문 방식</Label>
                  <Select value={orderType} onValueChange={(v) => setOrderType(v as BacktestOrderType)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                      <SelectValue placeholder="주문 방식 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                      <SelectItem value="BATCH" className="text-white hover:bg-white/10 rounded-lg">일괄 매수</SelectItem>
                      <SelectItem value="DIVIDED" className="text-white hover:bg-white/10 rounded-lg">분할 매수</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderType === "DIVIDED" && (
                  <div className="bg-white/5 p-4 rounded-xl space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300 text-sm">분할 횟수</Label>
                        <span className="text-indigo-400 font-semibold">{splitCount[0]}회</span>
                      </div>
                      <Slider 
                        value={splitCount}
                        onValueChange={setSplitCount}
                        max={20} 
                        min={2}
                        step={1}
                        className="py-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">투자 전략</Label>
                  <Select value={strategyType} onValueChange={(v) => setStrategyType(v as BacktestStrategyType)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                      <SelectValue placeholder="전략 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                      <SelectItem value="aggressive" className="text-white hover:bg-white/10 rounded-lg">공격적 (Aggressive)</SelectItem>
                      <SelectItem value="defensive" className="text-white hover:bg-white/10 rounded-lg">방어적 (Defensive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                  <div className="text-slate-300 text-sm">
                    {strategyType === "aggressive" ? (
                      <p>공격적 전략: 높은 수익을 추구하며, 변동성이 클 수 있습니다.</p>
                    ) : (
                      <p>방어적 전략: 안정적인 수익을 추구하며, 리스크를 최소화합니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            onClick={handleRunBacktest}
            disabled={isLoading || !selectedStock}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-14 font-semibold text-lg shadow-lg shadow-indigo-500/25 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                백테스트 실행 중...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                백테스트 실행
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-0">
          {/* Performance Chart */}
          <Card className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">수익률 추이</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 17, 27, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="strategy"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorStrategy)"
                    name="내 전략"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorBenchmark)"
                    name="벤치마크"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Key Metrics */}
          {result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card rounded-2xl p-5 hover:glow-profit transition-all">
                <div className="text-slate-400 text-sm mb-2">최종 수익률</div>
                <div className={`text-2xl font-bold flex items-center gap-2 ${result.totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <TrendingUp className="w-6 h-6" />
                  {result.totalReturnPct >= 0 ? '+' : ''}{result.totalReturnPct.toFixed(2)}%
                </div>
              </Card>

              <Card className="glass-card rounded-2xl p-5 hover:glow-sm transition-all">
                <div className="text-slate-400 text-sm mb-2">최종 자산</div>
                <div className="text-indigo-400 text-2xl font-bold">
                  {formatPrice(result.finalAssets, currency)}
                </div>
              </Card>

              <Card className="glass-card rounded-2xl p-5 hover:glow-loss transition-all">
                <div className="text-slate-400 text-sm mb-2">MDD (최대 낙폭)</div>
                <div className="text-rose-400 text-2xl font-bold">
                  -{result.mddPct.toFixed(2)}%
                </div>
              </Card>

              <Card className="glass-card rounded-2xl p-5 hover:glow-sm transition-all">
                <div className="text-slate-400 text-sm mb-2">총 수익금</div>
                <div className={`text-2xl font-bold ${result.totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.totalReturnPct >= 0 ? '+' : ''}{formatPrice(result.finalAssets - initialCapital, currency)}
                </div>
              </Card>
            </div>
          )}

          {/* Detailed Metrics */}
          {result && (
            <Card className="glass-card rounded-2xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">핵심 지표</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    { label: "승률", value: `${(result.winRate * 100).toFixed(1)}%`, icon: CheckCircle2, color: "text-emerald-400" },
                    { label: "총 거래 횟수", value: `${result.totalTrades}회`, icon: Target, color: "text-white" },
                    { label: "Sharpe Ratio", value: result.sharpeRatio.toFixed(2), icon: Sparkles, color: "text-indigo-400" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </span>
                        <span className={`font-semibold ${item.color}`}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {[
                    { label: "초기 자본", value: formatPrice(initialCapital, currency), color: "text-white" },
                    { label: "테스트 기간", value: `${startDate} ~ ${endDate}`, color: "text-slate-400" },
                    { label: "전략 유형", value: strategyType === "aggressive" ? "공격적" : "방어적", color: "text-purple-400" },
                    { label: "주문 방식", value: orderType === "BATCH" ? "일괄 매수" : `분할 매수 (${splitCount[0]}회)`, color: "text-slate-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* AI Feedback */}
          {result && (
            <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl h-fit">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">백테스트 결과 분석</h3>
                  <div className="space-y-3 text-slate-300">
                    {result.totalReturnPct > 0 ? (
                      <p className="leading-relaxed flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><span className="text-emerald-400 font-medium">수익:</span> 해당 전략은 {result.totalReturnPct.toFixed(2)}%의 수익률을 달성했습니다.
                        승률 {(result.winRate * 100).toFixed(1)}%로 {result.totalTrades}회 거래 중 성공적인 결과를 보였습니다.</span>
                      </p>
                    ) : (
                      <p className="leading-relaxed flex gap-2">
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <span><span className="text-rose-400 font-medium">손실:</span> 해당 전략은 {result.totalReturnPct.toFixed(2)}%의 손실을 기록했습니다.
                        전략 파라미터를 조정하거나 다른 전략을 시도해보세요.</span>
                      </p>
                    )}
                    <p className="leading-relaxed flex gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <span><span className="text-indigo-400 font-medium">분석:</span> MDD {result.mddPct.toFixed(2)}%, Sharpe Ratio {result.sharpeRatio.toFixed(2)}로 
                      {result.sharpeRatio > 1 ? ' 양호한 위험 조정 수익률을 보여줍니다.' : ' 위험 대비 수익률 개선이 필요합니다.'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={() => setShowResults(false)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12"
            >
              새로운 백테스트
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-emerald-500/25"
            >
              전략 저장
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
