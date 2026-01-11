import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
} from "recharts";
import CryptoCard from "../components/dashboard/CryptoCard";
import HoldingsTable from "../components/dashboard/HoldingsTable";
import WatchlistCard from "../components/dashboard/WatchlistCard";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import {
  getCryptoCards,
  getMarketOverviewData,
  getBasicStatistics,
  getPortfolioData,
  getHoldings,
  getWatchlist,
  getTransactions,
} from "../services/dashboard.service";

const ExchangeDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24H");
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["BTC", "ETH"]);
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly (2020)");

  const cryptoCards = getCryptoCards();
  const marketData = getMarketOverviewData();
  const statistics = getBasicStatistics();
  const portfolioData = useMemo(() => getPortfolioData(selectedTimeRange), [selectedTimeRange]);
  const holdings = getHoldings();
  const watchlist = getWatchlist();
  const transactions = getTransactions();

  const handleTokenToggle = (token: string) => {
    setSelectedTokens((prev) =>
      prev.includes(token)
        ? prev.filter((t) => t !== token)
        : [...prev, token]
    );
  };

  const statsChartData = useMemo(() => {
    const maxValue = Math.max(
      statistics.allTimeVolume,
      statistics.dailyTradeVolume,
      statistics.lockedValue,
      statistics.activeUsers
    );
    
    return [
      { 
        name: "Active Users", 
        value: statistics.activeUsers, 
        fill: "#a855f7",
        normalizedValue: (statistics.activeUsers / maxValue) * 100
      },
      { 
        name: "Locked Value", 
        value: statistics.lockedValue, 
        fill: "#3b82f6",
        normalizedValue: (statistics.lockedValue / maxValue) * 100
      },
      { 
        name: "24 Hour Trade Volume", 
        value: statistics.dailyTradeVolume, 
        fill: "#10b981",
        normalizedValue: (statistics.dailyTradeVolume / maxValue) * 100
      },
      { 
        name: "All time Volume", 
        value: statistics.allTimeVolume, 
        fill: "#f97316",
        normalizedValue: (statistics.allTimeVolume / maxValue) * 100
      },
    ];
  }, [statistics]);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}k`;
    }
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString("en-US");
  };

  return (
    <div className="w-full min-h-screen px-12 py-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-20">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors shadow-lg">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Filter Periode</span>
        </button>
      </div>

      <div className="relative mb-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cryptoCards.map((card) => (
            <CryptoCard key={card.id} data={card} />
          ))}
        </div>
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Previous"
        >
          <img 
            src="/icons/arrow-left.png" 
            alt="Previous"
            className="w-6 h-6"
          />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Next"
        >
          <img 
            src="/icons/arrow-right.png" 
            alt="Next"
            className="w-6 h-6"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-12">
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Market Overview
          </h2>
          <p className="text-sm text-white/60 mb-4">
            Lorem ipsum dolor sit amet, consectetur
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex gap-2">
              {["BTC", "ETH", "BNB", "XRP"].map((token) => (
                <label
                  key={token}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTokens.includes(token)}
                    onChange={() => handleTokenToggle(token)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">{token}</span>
                </label>
              ))}
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 rounded border border-white/20 bg-transparent text-white text-sm outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="Weekly (2020)" className="bg-[#0b0f2e]">
                Weekly (2020)
              </option>
              <option value="Monthly" className="bg-[#0b0f2e]">
                Monthly
              </option>
              <option value="Yearly" className="bg-[#0b0f2e]">
                Yearly
              </option>
            </select>
            <select className="px-3 py-1 rounded border border-white/20 bg-transparent text-white text-sm outline-none focus:ring-2 focus:ring-white/30">
              <option value="More Tokens" className="bg-[#0b0f2e]">
                More Tokens
              </option>
            </select>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData} key={`market-${selectedTokens.join('-')}`}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="week"
                  stroke="#ffffff60"
                  tick={{ fill: "#ffffff60", fontSize: 12 }}
                />
                <YAxis
                  stroke="#ffffff60"
                  tick={{ fill: "#ffffff60", fontSize: 12 }}
                  domain={[200000, 800000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                {selectedTokens.includes("BTC") && (
                  <Line
                    type="monotone"
                    dataKey="BTC"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="BTC"
                  />
                )}
                {selectedTokens.includes("ETH") && (
                  <Line
                    type="monotone"
                    dataKey="ETH"
                    stroke="#627EEA"
                    strokeWidth={2}
                    dot={false}
                    name="ETH"
                  />
                )}
                {selectedTokens.includes("BNB") && (
                  <Line
                    type="monotone"
                    dataKey="BNB"
                    stroke="#F3BA2F"
                    strokeWidth={2}
                    dot={false}
                    name="BNB"
                  />
                )}
                {selectedTokens.includes("XRP") && (
                  <Line
                    type="monotone"
                    dataKey="XRP"
                    stroke="#23292F"
                    strokeWidth={2}
                    dot={false}
                    name="XRP"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Basic Statistics
          </h2>

          <div className="h-48 mb-6 flex items-center justify-center relative" style={{ width: '100%' }}>
            {statsChartData.map((entry, index) => {
              const baseInner = 20;
              const gap = -5;
              const arcWidth = 20;
              
              const innerRadius = baseInner + index * (arcWidth + gap);
              const outerRadius = innerRadius + arcWidth;
              
              const singleData = [
                { 
                  name: 'max',
                  value: 100,
                  fill: 'rgba(0,0,0,0)'
                },
                { 
                  name: entry.name,
                  value: entry.normalizedValue,
                  fill: entry.fill
                }
              ];
              
              return (
                <div
                  key={entry.name}
                  className="absolute inset-0"
                  style={{ width: '100%', height: '100%' }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={`${innerRadius}%`}
                      outerRadius={`${outerRadius}%`}
                      startAngle={180}
                      endAngle={0}
                      data={singleData}
                      barSize={10}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={4}
                      >
                        {singleData.map((dataPoint, dataIndex) => (
                          <Cell 
                            key={`cell-${dataIndex}`} 
                            fill={dataPoint.fill === 'rgba(0,0,0,0)' ? 'transparent' : dataPoint.fill}
                          />
                        ))}
                      </RadialBar>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {statsChartData.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.fill }}
                  />
                  <span className="text-sm text-white/70">{stat.name}:</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {stat.name === "Active Users"
                    ? formatNumber(stat.value)
                    : formatCurrency(stat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Portfolio</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {formatCurrency(57660.35)}
              </span>
              <span className="text-sm text-green-500">+2.84%</span>
            </div>
          </div>
          <div className="flex gap-2">
            {["5 min", "15 min", "30 min", "1H", "24H", "1W", "1Y", "ALL"].map(
              (range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedTimeRange === range
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {range}
                </button>
              )
            )}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData} key={`portfolio-${selectedTimeRange}`}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: "#ffffff60", fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: "#ffffff60", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                name="Portfolio"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8 mt-12">
        <HoldingsTable holdings={holdings} />
      </div>

      <div className="mb-8 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">My watchlist</h2>
          <button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300"
            onClick={() => {}}
            aria-label="View all watchlist items"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <WatchlistCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
};

export default ExchangeDashboard;

