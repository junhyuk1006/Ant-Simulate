import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, DollarSign, RefreshCw, Award, TrendingUp, Target, Calendar, Settings, Bell, CreditCard, History, Loader2, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountApi, userApi } from "@/services/api";
import type { Account } from "@/types";
import { useTheme } from "@/hooks";
import { useCurrency } from "@/hooks/useCurrency";

interface UserInfo {
  email: string;
  name: string;
  nickname: string;
}

interface MyPageProps {
  userId?: number;
  nickname?: string;
}

export function MyPage({ userId, nickname }: MyPageProps) {
  const { isDark } = useTheme();
  const { formatPrice, currency } = useCurrency();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileNickname, setProfileNickname] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [newStartAsset, setNewStartAsset] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 사용자 정보 로드
  useEffect(() => {
    async function loadUserInfo() {
      if (!userId) {
        setIsUserLoading(false);
        return;
      }
      setIsUserLoading(true);
      try {
        const data = await userApi.getUser(userId);
        setUserInfo(data);
        setProfileName(data.name || "");
        setProfileNickname(data.nickname || "");
        setProfileEmail(data.email || "");
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        setIsUserLoading(false);
      }
    }
    loadUserInfo();
  }, [userId]);

  // 계좌 정보 로드
  useEffect(() => {
    async function loadAccount() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const accountData = await accountApi.getAccount(userId);
        setAccount(accountData);
        setNewStartAsset(String(accountData.startAsset));
      } catch (err) {
        console.error("Failed to load account:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAccount();
  }, [userId]);

  // 시드머니 변경
  const handleUpdateStartAsset = async () => {
    if (!account || !newStartAsset) return;
    setIsUpdating(true);
    try {
      await accountApi.updateStartAsset(account.accountId, parseInt(newStartAsset));
      setAccount(prev => prev ? { ...prev, startAsset: parseInt(newStartAsset), totalAsset: parseInt(newStartAsset) } : null);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update start asset:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 계좌 리셋
  const handleResetAccount = async () => {
    if (!account) return;
    if (!confirm("정말 계좌를 초기화하시겠습니까? 모든 거래 내역이 삭제됩니다.")) return;
    
    setIsUpdating(true);
    try {
      await accountApi.resetAsset(account.accountId);
      setAccount(prev => prev ? { ...prev, startAsset: 10000000, totalAsset: 10000000 } : null);
      setNewStartAsset("10000000");
    } catch (err) {
      console.error("Failed to reset account:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 프로필 업데이트
  const handleUpdateProfile = async () => {
    console.log("[MyPage] Update profile:", { userId, profileName, profileNickname });
    if (!userId || !profileName || !profileNickname) {
      alert("이름과 닉네임을 입력해주세요.");
      return;
    }
    setIsProfileUpdating(true);
    try {
      await userApi.updateUser(userId, profileName, profileNickname);
      if (userInfo) {
        setUserInfo({ ...userInfo, name: profileName, nickname: profileNickname });
      }
      // localStorage 업데이트
      localStorage.setItem("ant_nickname", profileNickname);
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMsg = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      alert(`프로필 업데이트에 실패했습니다: ${errorMsg}`);
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // 계정 탈퇴
  const handleDeleteAccount = async () => {
    if (!userId || !deletePassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!confirm("정말 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await userApi.deleteUser(userId, deletePassword);
      alert("계정이 성공적으로 탈퇴되었습니다.");
      // 로그아웃 처리
      localStorage.removeItem("ant_user_id");
      localStorage.removeItem("ant_nickname");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("계정 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeletePassword("");
    }
  };

  const profitRate = account ? ((account.totalAsset - account.startAsset) / account.startAsset * 100) : 0;
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userInfo?.nickname || nickname || '사용자'}</h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>ID: {userId}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">프리미엄</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">레벨 12</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white/5 rounded-xl p-1 mb-6 w-full md:w-auto">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <User className="w-4 h-4 mr-2" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <CreditCard className="w-4 h-4 mr-2" />
            가상 계좌
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <TrendingUp className="w-4 h-4 mr-2" />
            거래 통계
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <Shield className="w-4 h-4 mr-2" />
            보안
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-indigo-400" />
              <h3 className="text-white font-semibold">프로필 정보</h3>
            </div>
            {isUserLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">이름</Label>
                  <Input 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">닉네임</Label>
                  <Input 
                    value={profileNickname}
                    onChange={(e) => setProfileNickname(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">이메일</Label>
                <Input 
                  type="email"
                  value={profileEmail}
                  disabled
                  className="bg-white/5 border-white/10 text-slate-500 rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">휴대폰 번호</Label>
                <Input 
                  type="tel"
                  defaultValue="010-1234-5678"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <Button 
                onClick={handleUpdateProfile}
                disabled={isProfileUpdating}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11"
              >
                {isProfileUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : profileUpdateSuccess ? (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                ) : null}
                {profileUpdateSuccess ? '업데이트 완료!' : '프로필 업데이트'}
              </Button>
            </div>
            )}
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">알림 설정</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "목표가 도달 알림", description: "설정한 목표가에 도달하면 알림을 받습니다", enabled: true },
                { label: "손절가 경고 알림", description: "손절가 근처 도달 시 알림을 받습니다", enabled: true },
                { label: "시장 뉴스 알림", description: "관심 종목 관련 뉴스를 받습니다", enabled: false },
                { label: "주간 리포트 알림", description: "매주 포트폴리오 리포트를 받습니다", enabled: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Virtual Account Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>가상 계좌 관리</h3>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : account ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-5 rounded-xl">
                    <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>현재 시드 머니</div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formatPrice(account.startAsset, 'KRW')}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 p-5 rounded-xl">
                    <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>총 자산</div>
                    <div className={`text-2xl font-bold ${profitRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPrice(account.totalAsset, 'KRW')}
                    </div>
                    <div className={`text-sm mt-1 ${profitRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>초기 시드 머니 설정</Label>
                    <Input 
                      type="number"
                      value={newStartAsset}
                      onChange={(e) => setNewStartAsset(e.target.value)}
                      placeholder="초기 투자 금액"
                      className={`rounded-xl h-11 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                    />
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                      최소 100만원, 최대 10억원까지 설정 가능합니다.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleUpdateStartAsset}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : updateSuccess ? (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      ) : null}
                      {updateSuccess ? '변경 완료!' : '시드 머니 변경'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleResetAccount}
                      disabled={isUpdating}
                      className="bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl h-11"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                      계좌 초기화 (1,000만원)
                    </Button>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                    <p className="text-amber-300 text-sm">
                      ⚠️ 계좌 초기화 시 시드머니가 1,000만원으로 리셋됩니다. 포트폴리오와 거래 내역은 유지됩니다.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                계좌 정보를 불러올 수 없습니다.
              </div>
            )}
          </Card>

          {/* Transaction History */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">최근 거래 내역</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                전체 보기
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { type: "buy", stock: "삼성전자", quantity: 10, price: 50000, time: "오늘 14:30" },
                { type: "sell", stock: "SK하이닉스", quantity: 5, price: 115000, time: "어제 10:15" },
                { type: "buy", stock: "NAVER", quantity: 3, price: 195000, time: "3일 전" },
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400 rotate-180'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.stock}</p>
                      <p className="text-slate-500 text-sm">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'buy' ? '매수' : '매도'} {tx.quantity}주
                    </p>
                    <p className="text-slate-400 text-sm">{formatPrice(tx.price * tx.quantity, 'KRW')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Account Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "총 거래 횟수", value: "145회", icon: Target, color: "text-indigo-400", bg: "from-indigo-500/20 to-purple-500/20" },
              { label: "평균 수익률", value: "+8.5%", icon: TrendingUp, color: "text-emerald-400", bg: "from-emerald-500/20 to-green-500/20" },
              { label: "승률", value: "62.3%", icon: Award, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
              { label: "가입일", value: "2024.06", icon: Calendar, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="glass-card rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </Card>
              );
            })}
          </div>

          {/* Detailed Stats */}
          <Card className="glass-card rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">상세 거래 통계</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { label: "총 수익 거래", value: "90회", color: "text-emerald-400" },
                  { label: "총 손실 거래", value: "55회", color: "text-rose-400" },
                  { label: "최대 단일 수익", value: "+15.3%", color: "text-emerald-400" },
                  { label: "최대 단일 손실", value: "-8.7%", color: "text-rose-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "평균 보유 기간", value: "12일", color: "text-white" },
                  { label: "총 거래 금액", value: "1.2억원", color: "text-white" },
                  { label: "총 수수료", value: "180,000원", color: "text-slate-400" },
                  { label: "순 수익", value: "+2,450,000원", color: "text-emerald-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold">비밀번호 변경</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">현재 비밀번호</Label>
                <Input 
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">새 비밀번호</Label>
                <Input 
                  type="password"
                  placeholder="새 비밀번호 입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">새 비밀번호 확인</Label>
                <Input 
                  type="password"
                  placeholder="새 비밀번호 재입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11">
                비밀번호 변경
              </Button>
            </div>
          </Card>

          {/* Two Factor Auth */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">2단계 인증</h3>
                  <p className="text-slate-400 text-sm">계정 보안을 강화하세요</p>
                </div>
              </div>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                설정하기
              </Button>
            </div>
          </Card>

          {/* Connected Accounts */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">연결된 계정</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Google", email: "user@gmail.com", connected: true },
                { name: "Kakao", email: "연결되지 않음", connected: false },
              ].map((account, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5">
                  <div>
                    <p className="text-white font-medium">{account.name}</p>
                    <p className="text-slate-500 text-sm">{account.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-lg ${
                      account.connected 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {account.connected ? '연결 해제' : '연결하기'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Account Deletion */}
          <Card className="glass-card rounded-2xl p-6 border-rose-500/20">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-rose-400" />
              <h3 className="text-white font-semibold">계정 탈퇴</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                <p className="text-rose-300 text-sm mb-2 font-medium">⚠️ 주의사항</p>
                <ul className="text-rose-300/80 text-xs space-y-1 list-disc list-inside">
                  <li>계정 탈퇴 시 모든 데이터가 영구적으로 삭제됩니다.</li>
                  <li>포트폴리오, 거래 내역, 계좌 정보가 모두 삭제됩니다.</li>
                  <li>탈퇴 후에는 복구가 불가능합니다.</li>
                </ul>
              </div>
              
              {showDeleteDialog ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">비밀번호 확인</Label>
                    <Input 
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                      disabled={isDeleting}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || !deletePassword}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          탈퇴 처리 중...
                        </>
                      ) : (
                        "탈퇴 확인"
                      )}
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeletePassword("");
                      }}
                      disabled={isDeleting}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-11"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="outline"
                  className="w-full bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl h-11"
                >
                  계정 탈퇴하기
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
