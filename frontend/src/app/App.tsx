import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LoginScreen, SignupScreen, TradingCenter, Portfolio, BacktestingLab, MyPage, MarketNews, StockDetailScreen } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme, useCurrency } from "@/hooks";
import type { StockItem } from "@/types";
import { stocksApi } from "@/services/api";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Briefcase, 
  FlaskConical, 
  User,
  Search,
  Bell,
  Newspaper,
  ChevronDown,
  Settings,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Screen = "login" | "signup" | "trading" | "portfolio" | "backtesting" | "mypage" | "news" | "stockDetail";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [selectedStockForDetail, setSelectedStockForDetail] = useState<StockItem | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const { currency, toggleCurrency } = useCurrency();
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const [allStockItems, setAllStockItems] = useState<StockItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 주식 목록 로드 (헤더 검색용)
  useEffect(() => {
    async function loadStocksForSearch() {
      try {
        const items = await stocksApi.getStockItems();
        setAllStockItems(items);
      } catch (err) {
        console.error("검색용 주식 목록 로드 실패:", err);
      }
    }
    loadStocksForSearch();
  }, []);

  // 검색 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setHeaderSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 헤더 검색 결과
  const headerSearchResults = useMemo(() => {
    if (!headerSearchQuery.trim()) return [];
    const q = headerSearchQuery.toLowerCase();
    return allStockItems.filter(stock => {
      const symbol = stock.stockSymbol || stock.symbol || "";
      const name = stock.stockName || stock.name || "";
      const alias = stock.stockAlias || "";
      return symbol.toLowerCase().includes(q) || name.toLowerCase().includes(q) || alias.toLowerCase().includes(q);
    }).slice(0, 10);
  }, [allStockItems, headerSearchQuery]);

  const handleSearchSelect = useCallback((stock: StockItem) => {
    setHeaderSearchQuery("");
    setHeaderSearchFocused(false);
    setCurrentScreen("trading");
    setSelectedStockFromSearch(stock);
  }, []);

  const [selectedStockFromSearch, setSelectedStockFromSearch] = useState<StockItem | null>(null);

  // 로그인 상태 복구
  useEffect(() => {
    const savedUserId = localStorage.getItem("ant_user_id");
    const savedNickname = localStorage.getItem("ant_nickname");
    const sessionLoggedIn = sessionStorage.getItem("ant_session_logged_in");
    if (savedUserId && sessionLoggedIn === "true") {
      setUserId(Number(savedUserId));
      setNickname(savedNickname || "");
      setIsLoggedIn(true);
      setCurrentScreen("trading");
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogin = (loginUserId: number, loginNickname: string) => {
    setUserId(loginUserId);
    setNickname(loginNickname);
    setIsLoggedIn(true);
    sessionStorage.setItem("ant_session_logged_in", "true");
    setCurrentScreen("trading");
  };

  const handleSignupComplete = (signupUserId: number, signupNickname: string) => {
    setUserId(signupUserId);
    setNickname(signupNickname);
    setIsLoggedIn(true);
    sessionStorage.setItem("ant_session_logged_in", "true");
    setCurrentScreen("trading");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("ant_user_id");
    localStorage.removeItem("ant_nickname");
    sessionStorage.removeItem("ant_session_logged_in");
    setUserId(null);
    setNickname("");
    setIsLoggedIn(false);
    setCurrentScreen("login");
  };

  const handleStockDetail = (stockItem: StockItem) => {
    setSelectedStockForDetail(stockItem);
    setCurrentScreen("stockDetail");
  };

  const handleBackFromStockDetail = () => {
    setSelectedStockForDetail(null);
    setCurrentScreen("trading");
  };

  if (!isLoggedIn) {
    if (currentScreen === "signup") {
      return <SignupScreen onSignupComplete={handleSignupComplete} onBackToLogin={handleBackToLogin} />;
    }
    return <LoginScreen onLogin={handleLogin} onSignupClick={() => setCurrentScreen("signup")} />;
  }

  const navItems = [
    { id: "trading" as const, label: "거래소", icon: LayoutDashboard },
    { id: "portfolio" as const, label: "포트폴리오", icon: Briefcase },
    { id: "backtesting" as const, label: "백테스팅", icon: FlaskConical },
    { id: "news" as const, label: "시장 뉴스", icon: Newspaper },
  ];

  const notifications = [
    { id: 1, title: "삼성전자 목표가 도달", message: "설정하신 목표가 55,000원에 도달했습니다.", time: "5분 전", type: "success" },
    { id: 2, title: "포트폴리오 수익률 알림", message: "오늘 수익률이 +5%를 돌파했습니다.", time: "1시간 전", type: "info" },
    { id: 3, title: "시장 변동성 경고", message: "KOSPI 지수가 급격히 하락하고 있습니다.", time: "2시간 전", type: "warning" },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : 'light'} ${isDark ? 'bg-[#0a0a0f]' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30'}`}>
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/20'}`} />
        <div className={`absolute top-1/3 -left-40 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/15'}`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-400/10'}`} />
      </div>

      {/* Top Navigation Bar */}
      <header className={`relative z-50 glass border-b ${isDark ? 'border-white/5' : 'border-slate-200/80'}`}>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              {/* Logo */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Ant-Simulate</h1>
                  <p className={`text-[10px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>실시간 모의투자</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => setCurrentScreen(item.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? isDark ? "text-white" : "text-slate-900"
                          : isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30" />
                      )}
                      <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-indigo-400" : ""}`} />
                      <span className="relative z-10 font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Stock Search */}
              <div ref={searchRef} className="relative hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="종목 검색 (심볼/이름)"
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    onFocus={() => setHeaderSearchFocused(true)}
                    className={`pl-9 pr-8 rounded-xl h-9 w-56 text-sm transition-all duration-200 focus:w-72 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-500'}`}
                  />
                  {headerSearchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setHeaderSearchQuery(""); }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {/* Search Dropdown */}
                {headerSearchFocused && headerSearchQuery.trim() && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-[100] ${isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-slate-200'}`}>
                    {headerSearchResults.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto scrollbar-themed py-1">
                        {headerSearchResults.map((stock) => (
                          <div
                            key={stock.id}
                            onClick={() => handleSearchSelect(stock)}
                            className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {stock.stockName || stock.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                  {stock.stockSymbol || stock.symbol}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  stock.stockCountry === 'US'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {stock.stockType}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`px-4 py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        검색 결과가 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Currency Toggle */}
              <Button
                variant="ghost"
                onClick={toggleCurrency}
                className={`rounded-xl h-10 px-2 border transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10' 
                    : 'bg-slate-100/50 hover:bg-slate-200/50'
                } ${
                  /* Dynamic Border Color */
                  currency === 'USD'
                    ? isDark ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-emerald-500/30'
                    : isDark ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-indigo-500/30'
                }`}
                title="통화 변경 (KRW / USD)"
              >
                <div className="flex items-center gap-1">
                  {/* USD */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg border-[1.5px] transition-all duration-200 ${
                    currency === 'USD' 
                      ? 'border-emerald-500 text-emerald-500 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-bold opacity-100 scale-110' 
                      : 'border-transparent text-slate-400 font-normal opacity-50 scale-90'
                  }`}>
                    <span className="text-xs">$</span>
                  </div>
                  
                  {/* KRW */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg border-[1.5px] transition-all duration-200 ${
                    currency === 'KRW'
                      ? 'border-indigo-500 text-indigo-500 bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.3)] font-bold opacity-100 scale-110'
                      : 'border-transparent text-slate-400 font-normal opacity-50 scale-90'
                  }`}>
                    <span className="text-xs">₩</span>
                  </div>
                </div>
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`rounded-xl w-10 h-10 relative ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-pulse" />
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 top-12 w-80 glass-card rounded-2xl p-4 animate-fade-in ${isDark ? '' : 'bg-white shadow-lg border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>알림</h3>
                      <Button variant="ghost" size="sm" className="text-indigo-400 text-xs hover:text-indigo-300">
                        모두 읽음
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'success' ? 'bg-emerald-400' :
                              notif.type === 'warning' ? 'bg-amber-400' : 'bg-indigo-400'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{notif.title}</p>
                              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{notif.message}</p>
                              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 glass-card rounded-xl p-2 ${isDark ? 'border-white/10' : 'bg-white border-slate-200 shadow-lg'}`} align="end">
                  <DropdownMenuLabel className={`text-xs px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                  <DropdownMenuItem 
                    onClick={() => setCurrentScreen("mypage")}
                    className={`rounded-lg cursor-pointer ${isDark ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`rounded-lg cursor-pointer ${isDark ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}>
                    <Settings className="w-4 h-4 mr-2" />
                    설정
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={toggleTheme}
                    className={`rounded-lg cursor-pointer ${isDark ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDark ? '라이트 모드' : '다크 모드'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`lg:hidden glass border-b px-4 py-2 relative z-40 ${isDark ? 'border-white/5' : 'border-slate-200/80'}`}>
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                  isActive 
                    ? "text-indigo-400 bg-indigo-500/10" 
                    : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="animate-fade-in">
          {currentScreen === "trading" && (
            <TradingCenter 
              onStockDetail={handleStockDetail} 
              userId={userId || undefined}
              selectedStockFromSearch={selectedStockFromSearch}
              onSelectedStockFromSearchHandled={() => setSelectedStockFromSearch(null)}
            />
          )}
          {currentScreen === "stockDetail" && selectedStockForDetail && (
            <StockDetailScreen 
              stockItem={selectedStockForDetail} 
              onBack={handleBackFromStockDetail}
            />
          )}
          {currentScreen === "portfolio" && <Portfolio />}
          {currentScreen === "backtesting" && <BacktestingLab />}
          {currentScreen === "mypage" && (
            <MyPage 
              userId={userId || undefined} 
              nickname={nickname} 
            />
          )}
          {currentScreen === "news" && <MarketNews />}
        </div>
      </main>

      {/* Enhanced Status Bar */}
      <footer className={`relative z-40 glass border-t px-6 py-3 ${isDark ? 'border-white/5' : 'border-slate-200/80'}`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>시장 상태: <span className="text-emerald-400 font-medium">정상</span></span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>KOSPI</span>
              <span className="text-emerald-400 font-semibold">2,650.45</span>
              <span className="text-emerald-400 text-xs">(+1.2%)</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>KOSDAQ</span>
              <span className="text-emerald-400 font-semibold">850.23</span>
              <span className="text-emerald-400 text-xs">(+0.8%)</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>USD/KRW</span>
              <span className="text-rose-400 font-semibold">1,380.50</span>
              <span className="text-rose-400 text-xs">(-0.3%)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs">AI 분석 활성화</span>
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              업데이트: 2026-01-20 15:30:00
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
