import React from 'react';
import { TrendingUp, BarChart2, Zap, Shield, ChevronUp, ChevronDown } from 'lucide-react';
// NEW: Import components from the recharts library
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';


// --- MOCK DATA ---
// NEW: Mock P&L data for the main portfolio chart
const portfolioChartData = [
  { date: 'Jul \'25', pnl: 2500 },
  { date: 'Aug \'25', pnl: 4500 },
  { date: 'Sep \'25', pnl: 3500 },
  { date: 'Oct \'25', pnl: 5500 },
  { date: 'Nov \'25', pnl: 7500 },
  { date: 'Dec \'25', pnl: 9500 },
];

const watchlistItems = [
  { symbol: 'BTC/USD', price: 68745.12, change: 2.34 },
  { symbol: 'ETH/USD', price: 4210.88, change: 3.12 },
  { symbol: 'TSLA', price: 182.45, change: -1.05 },
  { symbol: 'NVDA', price: 903.67, change: 0.89 },
];

const strategies = [
  { name: 'RSI Momentum Scalper', status: 'Active', pnl: 245.50, performance: [5, 8, 6, 9, 7] },
  { name: 'Mean Reversion ETH', status: 'Active', pnl: -78.21, performance: [6, 4, 5, 2, 3] },
  { name: 'BTC Breakout', status: 'Paused', pnl: 12.33, performance: [5, 5, 6, 5, 7] },
];

// --- Reusable Card Component ---
const DashboardCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md flex flex-col ${className}`}>
    <div className="p-4 border-b flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4 flex-grow">
      {children}
    </div>
  </div>
);


// --- Individual Dashboard Components ---

const PortfolioSummary = () => {
  const portfolioData = { value: 124530.75, dailyPnl: 1823.55, dailyPnlPercent: 1.49 };
  const isProfit = portfolioData.dailyPnl >= 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-blue-100">Total Portfolio Value</p>
          <p className="text-4xl font-bold">${portfolioData.value.toLocaleString()}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isProfit ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
          {isProfit ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{isProfit ? '+' : '-'}${Math.abs(portfolioData.dailyPnl).toLocaleString()} ({portfolioData.dailyPnlPercent}%) Today</span>
        </div>
      </div>
      {/* NEW: Interactive P&L Chart using Recharts */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#333' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'P&L']}
            />
            <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
            <Area type="monotone" dataKey="pnl" stroke="#ffffff" fill="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Watchlist = () => (
  <DashboardCard title="Watchlist" icon={<BarChart2 className="text-blue-500" />}>
    <ul className="space-y-3">
      {watchlistItems.map(item => {
        const isUp = item.change >= 0;
        return (
          <li key={item.symbol} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.symbol}</p>
              <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
            </div>
            <div className={`px-3 py-1 text-sm font-semibold rounded-full ${isUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isUp ? '+' : ''}{item.change.toFixed(2)}%
            </div>
          </li>
        );
      })}
    </ul>
  </DashboardCard>
);

const ActiveStrategies = () => (
  <DashboardCard title="Active Strategies" icon={<Zap className="text-yellow-500" />}>
    <ul className="space-y-4">
      {strategies.map(strat => {
        const isProfit = strat.pnl >= 0;
        const statusColor = strat.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const maxPerf = Math.max(...strat.performance);

        return (
          <li key={strat.name} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               {/* NEW: Mini performance bar chart for each strategy */}
               <div className="flex items-end h-8 gap-0.5">
                  {strat.performance.map((p, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-blue-200 rounded-full"
                      style={{ height: `${(p / maxPerf) * 100}%` }}
                    ></div>
                  ))}
               </div>
              <div>
                <p className="font-semibold">{strat.name}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}>{strat.status}</span>
              </div>
            </div>
            <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : '-'}${Math.abs(strat.pnl).toFixed(2)}
            </p>
          </li>
        );
      })}
    </ul>
  </DashboardCard>
);

const RiskDial = () => {
  const riskLevel = 'Medium';
  const rotation = riskLevel === 'Low' ? -45 : riskLevel === 'Medium' ? 0 : 45;

  return (
    <DashboardCard title="Portfolio Risk" icon={<Shield className="text-red-500" />}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-40 h-20 overflow-hidden mb-2">
          <div className="absolute top-0 w-40 h-40 border-8 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 w-40 h-40 border-8 border-transparent border-t-green-500 rounded-full -rotate-45"></div>
          <div className="absolute top-0 w-40 h-40 border-8 border-transparent border-t-yellow-500 rounded-full"></div>
          <div className="absolute top-0 w-40 h-40 border-8 border-transparent border-t-red-500 rounded-full rotate-45"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-16 bg-gray-800 transition-transform duration-500" style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, transformOrigin: 'bottom center' }}></div>
        </div>
        <p className="font-semibold text-lg">{riskLevel}</p>
      </div>
    </DashboardCard>
  );
};


// --- Main Home Page Component ---
export default function HomePage() {
  return (
    <div className="space-y-6">
      <PortfolioSummary />

      {/* FIXED: Corrected grid layout for the main cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveStrategies />
        </div>
        <div className="lg:col-span-1">
          <RiskDial />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Watchlist />
      </div>
    </div>
  );
}