import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Wallet, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { useCurrency } from "@/hooks/useCurrency";

const mockHoldings = [
  {
    id: 1,
    name: "삼성전자",
    code: "005930",
    quantity: 100,
    avgPrice: 48000,
    currentPrice: 50000,
    value: 5000000,
    profitLoss: 200000,
    profitRate: 4.17,
  },
  {
    id: 2,
    name: "SK하이닉스",
    code: "000660",
    quantity: 50,
    avgPrice: 120000,
    currentPrice: 115000,
    value: 5750000,
    profitLoss: -250000,
    profitRate: -4.17,
  },
  {
    id: 3,
    name: "NAVER",
    code: "035420",
    quantity: 30,
    avgPrice: 180000,
    currentPrice: 195000,
    value: 5850000,
    profitLoss: 450000,
    profitRate: 8.33,
  },
];

const assetData = [
  { name: "현금", value: 3400000, color: "#6366f1" },
  { name: "삼성전자", value: 5000000, color: "#10b981" },
  { name: "SK하이닉스", value: 5750000, color: "#f59e0b" },
  { name: "NAVER", value: 5850000, color: "#ec4899" },
];

const performanceData = [
  { date: "1월", value: 18000000 },
  { date: "2월", value: 18500000 },
  { date: "3월", value: 18200000 },
  { date: "4월", value: 19100000 },
  { date: "5월", value: 19800000 },
  { date: "6월", value: 20000000 },
];

export function Portfolio() {
  const { formatPrice, currency } = useCurrency();
  const totalAssets = 20000000;
  const totalInvestment = 18000000;
  const totalProfitLoss = 400000;
  const totalProfitRate = 2.22;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card rounded-2xl p-5 group hover:glow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm mb-1">총 자산</div>
              <div className="text-white text-2xl font-bold">{formatPrice(totalAssets, 'KRW')}</div>
              <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                전일 대비 +1.2%
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-2xl p-5 group hover:glow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm mb-1">총 투자금</div>
              <div className="text-white text-2xl font-bold">{formatPrice(totalInvestment, 'KRW')}</div>
              <div className="text-slate-500 text-xs mt-1">투자 비중 82%</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-2xl p-5 group hover:glow-profit transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm mb-1">총 평가손익</div>
              <div className="text-emerald-400 text-2xl font-bold">
                +{formatPrice(totalProfitLoss, 'KRW')}
              </div>
              <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{totalProfitRate}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-2xl p-5 group hover:glow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm mb-1">보유 종목</div>
              <div className="text-white text-2xl font-bold">3개</div>
              <div className="text-amber-400 text-xs mt-1">수익 2개 / 손실 1개</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <Card className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white text-lg font-semibold">자산 구성</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 17, 27, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance Chart */}
        <Card className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white text-lg font-semibold">자산 추이</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 17, 27, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Asset Summary */}
      <Card className="glass-card rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">자산 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assetData.map((asset, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: asset.color }}
                />
                <span className="text-slate-300 font-medium">{asset.name}</span>
              </div>
              <div className="text-white text-lg font-bold">{formatPrice(asset.value, 'KRW')}</div>
              <div className="text-slate-500 text-sm mt-1">
                {((asset.value / totalAssets) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Holdings Table */}
      <Card className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-white text-lg font-semibold">보유 종목</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left text-slate-400 font-medium p-4 text-sm">종목명</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">보유수량</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">평균단가</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">현재가</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">평가금액</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">평가손익</th>
                <th className="text-right text-slate-400 font-medium p-4 text-sm">수익률</th>
              </tr>
            </thead>
            <tbody>
              {mockHoldings.map((holding) => (
                <tr 
                  key={holding.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="text-white font-medium group-hover:text-indigo-400 transition-colors">{holding.name}</div>
                    <div className="text-slate-500 text-sm">{holding.code}</div>
                  </td>
                  <td className="text-right text-slate-300 p-4">
                    {holding.quantity.toLocaleString()}주
                  </td>
                  <td className="text-right text-slate-300 p-4">
                    {formatPrice(holding.avgPrice, 'KRW')}
                  </td>
                  <td className="text-right text-white font-medium p-4">
                    {formatPrice(holding.currentPrice, 'KRW')}
                  </td>
                  <td className="text-right text-white font-medium p-4">
                    {formatPrice(holding.value, 'KRW')}
                  </td>
                  <td className={`text-right p-4 font-semibold ${holding.profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {holding.profitLoss >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {holding.profitLoss >= 0 ? '+' : ''}{formatPrice(Math.abs(holding.profitLoss), 'KRW')}
                    </div>
                  </td>
                  <td className={`text-right p-4 ${holding.profitRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      holding.profitRate >= 0 
                        ? 'bg-emerald-500/20' 
                        : 'bg-rose-500/20'
                    }`}>
                      {holding.profitRate >= 0 ? '+' : ''}{holding.profitRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
