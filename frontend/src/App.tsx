import { useState } from "react";
import { 
  LoginScreen, 
  SignupScreen,
  TradingCenter, 
  Portfolio, 
  BacktestingLab, 
  MyPage, 
  MarketNews 
} from "@/components";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks";
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
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Screen = "login" | "signup" | "trading" | "portfolio" | "backtesting" | "mypage" | "news";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = (userNickname: string) => {
    setNickname(userNickname);
    setIsLoggedIn(true);
    setCurrentScreen("trading");
  };

  const handleSignup = (userNickname: string) => {
    setNickname(userNickname);
    setIsLoggedIn(true);
    setCurrentScreen("trading");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname("");
    setCurrentScreen("login");
  };

  if (!isLoggedIn) {
    if (currentScreen === "signup") {
      return (
        <SignupScreen 
          onSignup={handleSignup} 
          onBackToLogin={() => setCurrentScreen("login")} 
        />
      );
    }
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onSignupClick={() => setCurrentScreen("signup")} 
      />
    );
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'dark bg-[#0a0a0f]' : 'light bg-slate-50'}`}>
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/20'}`} />
        <div className={`absolute top-1/3 -left-40 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/15'}`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`} />
      </div>

      {/* Top Navigation Bar */}
      <header className={`relative z-50 glass border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
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
                          : isDark 
                            ? "text-slate-400 hover:text-white hover:bg-white/5" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 rounded-xl border ${isDark ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`} />
                      )}
                      <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-indigo-500" : ""}`} />
                      <span className="relative z-10 font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl w-10 h-10 ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`rounded-xl w-10 h-10 relative ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-pulse" />
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 glass-card rounded-2xl p-4 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>알림</h3>
                      <Button variant="ghost" size="sm" className="text-indigo-500 text-xs hover:text-indigo-400">
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className={`hidden md:inline font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{nickname}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 glass-card rounded-xl p-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`} align="end">
                  <DropdownMenuLabel className={`text-xs px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                  <DropdownMenuItem 
                    onSelect={() => setCurrentScreen("mypage")}
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
                    onSelect={toggleTheme}
                    className={`rounded-lg cursor-pointer ${isDark ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDark ? '라이트 모드' : '다크 모드'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                  <DropdownMenuItem 
                    onSelect={handleLogout}
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
      <div className={`lg:hidden glass border-b px-4 py-2 relative z-40 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
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
                    ? "text-indigo-500 bg-indigo-500/10" 
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
          {currentScreen === "trading" && <TradingCenter />}
          {currentScreen === "portfolio" && <Portfolio />}
          {currentScreen === "backtesting" && <BacktestingLab />}
          {currentScreen === "mypage" && <MyPage />}
          {currentScreen === "news" && <MarketNews />}
        </div>
      </main>

      {/* Enhanced Status Bar */}
      <footer className={`relative z-40 glass border-t px-6 py-3 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>시장 상태: <span className="text-emerald-500 font-medium">정상</span></span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>KOSPI</span>
              <span className="text-emerald-500 font-semibold">2,650.45</span>
              <span className="text-emerald-500 text-xs">(+1.2%)</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>KOSDAQ</span>
              <span className="text-emerald-500 font-semibold">850.23</span>
              <span className="text-emerald-500 text-xs">(+0.8%)</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>USD/KRW</span>
              <span className="text-rose-500 font-semibold">1,380.50</span>
              <span className="text-rose-500 text-xs">(-0.3%)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs">AI 분석 활성화</span>
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              업데이트: 2026-01-20 15:30:00
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
