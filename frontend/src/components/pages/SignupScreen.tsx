import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TrendingUp, Mail, Lock, ArrowRight, Sparkles, User, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks";

interface SignupScreenProps {
  onSignup: (nickname: string) => void;
  onBackToLogin: () => void;
}

export function SignupScreen({ onSignup, onBackToLogin }: SignupScreenProps) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleSignup = async () => {
    setError(null);

    // 유효성 검사
    if (!email || !password || !confirmPassword || !name || !nickname) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          nickname,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "회원가입에 실패했습니다.";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        } catch {
          errorMessage = errorText || "회원가입에 실패했습니다.";
        }
        throw new Error(errorMessage);
      }

      // 회원가입 성공 시 로그인 화면으로 이동
      onBackToLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${isDark ? 'dark bg-[#0a0a0f]' : 'light bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/30'}`} />
        <div className={`absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-purple-500/15' : 'bg-purple-400/25'}`} style={{ animationDelay: '1s' }} />
        <div className={`absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/20'}`} style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: isDark 
              ? 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60" />
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>회원가입</h1>
          <p className={`text-sm flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Ant-Simulate와 함께 투자를 시작하세요
          </p>
        </div>

        {/* Signup Card */}
        <Card className={`rounded-2xl p-8 animate-slide-up border ${isDark ? 'glass-card' : 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>이메일</Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>이름</Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>닉네임</Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="nickname" 
                  type="text" 
                  placeholder="투자왕개미"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>비밀번호</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>비밀번호 확인</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-12 font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 group disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "회원가입"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>이미 계정이 있으신가요? </span>
            <button 
              onClick={onBackToLogin}
              className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              로그인
            </button>
          </div>
        </Card>

        {/* Footer Text */}
        <p className={`text-center text-xs mt-6 animate-fade-in ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          회원가입 시 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>서비스 약관</span> 및 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>개인정보 처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
