export interface CryptoCardData {
  id: string;
  name: string;
  value: number;
  change: number;
  changeText: string;
  icon?: string;
}

export interface MarketOverviewData {
  week: string;
  BTC?: number;
  ETH?: number;
  BNB?: number;
  XRP?: number;
}

export interface BasicStatistics {
  allTimeVolume: number;
  dailyTradeVolume: number;
  lockedValue: number;
  activeUsers: number;
}

export interface PortfolioDataPoint {
  time: string;
  value: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  value: number;
  profitLoss: number;
  profitLossPercent: number;
  chartData: number[];
  icon?: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
  chartData: number[];
  icon?: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  action: "Buy" | "Sell";
  date: string;
  time: string;
  units: number;
  price: number;
  total: number;
  icon?: string;
}

export const getCryptoCards = (): CryptoCardData[] => {
  return [
    {
      id: "etc",
      name: "Ethereum Classic",
      value: 168331.09,
      change: 45,
      changeText: "45% This week",
      icon: "/icons/overview/ethclassic.png",
    },
    {
      id: "btc",
      name: "Bitcoin",
      value: 24098,
      change: 45,
      changeText: "45% This week",
      icon: "/icons/overview/bitcoin.png",
    },
    {
      id: "ltc",
      name: "Litecoin",
      value: 667224,
      change: 0,
      changeText: "This week",
      icon: "/icons/overview/litecoin.png",
    },
    {
      id: "xmr",
      name: "Monero",
      value: 18783.33,
      change: 45,
      changeText: "45% This week",
      icon: "/icons/overview/monero.png",
    },
  ];
};

export const getMarketOverviewData = (): MarketOverviewData[] => {
  return [
    { week: "Week 01", BTC: 250000, ETH: 180000, BNB: 320000, XRP: 150000 },
    { week: "Week 02", BTC: 280000, ETH: 220000, BNB: 350000, XRP: 145000 },
    { week: "Week 03", BTC: 320000, ETH: 280000, BNB: 380000, XRP: 160000 },
    { week: "Week 04", BTC: 380000, ETH: 350000, BNB: 420000, XRP: 175000 },
    { week: "Week 05", BTC: 420000, ETH: 380000, BNB: 450000, XRP: 190000 },
    { week: "Week 06", BTC: 480000, ETH: 420000, BNB: 480000, XRP: 210000 },
    { week: "Week 07", BTC: 550000, ETH: 480000, BNB: 520000, XRP: 240000 },
    { week: "Week 08", BTC: 620000, ETH: 550000, BNB: 580000, XRP: 280000 },
    { week: "Week 09", BTC: 680000, ETH: 620000, BNB: 640000, XRP: 320000 },
    { week: "Week 10", BTC: 750000, ETH: 700000, BNB: 720000, XRP: 380000 },
  ];
};

export const getBasicStatistics = (): BasicStatistics => {
  return {
    allTimeVolume: 167884.21,
    dailyTradeVolume: 56411.33,
    lockedValue: 81981.22,
    activeUsers: 45628,
  };
};

export const getPortfolioData = (timeRange: string = "24H"): PortfolioDataPoint[] => {
  const data: PortfolioDataPoint[] = [];
  const baseValue = 57660.35;
  const now = new Date();
  
  let intervals = 24;
  let intervalMinutes = 60;
  
  if (timeRange === "5 min") {
    intervals = 12;
    intervalMinutes = 5;
  } else if (timeRange === "15 min") {
    intervals = 16;
    intervalMinutes = 15;
  } else if (timeRange === "30 min") {
    intervals = 16;
    intervalMinutes = 30;
  } else if (timeRange === "1H") {
    intervals = 24;
    intervalMinutes = 60;
  } else if (timeRange === "24H") {
    intervals = 24;
    intervalMinutes = 60;
  } else if (timeRange === "1W") {
    intervals = 7;
    intervalMinutes = 1440; // 24 hours
  } else if (timeRange === "1Y") {
    intervals = 12;
    intervalMinutes = 43200; // 30 days
  } else {
    intervals = 30;
    intervalMinutes = 1440;
  }
  
  for (let i = intervals; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const variation = (Math.random() - 0.5) * 0.1;
    data.push({
      time: `${hours}:${minutes}`,
      value: baseValue * (1 + variation),
    });
  }
  
  return data;
};

const getIconPath = (symbol: string): string => {
  const iconMap: { [key: string]: string } = {
    BTC: "/icons/bitcoin.png",
    ETH: "/icons/ethereum.png",
    LTC: "/icons/litecoin.png",
    COMP: "/icons/compound.png",
    AAVE: "/icons/aave.png",
    DOGE: "/icons/dogecoin.png",
    UNI: "/icons/uniswap.png",
    GRT: "/icons/grt.png",
    XTZ: "/icons/tezos.png",
    XMR: "/icons/overview/monero.png",
  };
  return iconMap[symbol] || "/icons/bitcoin.png";
};

export const getHoldings = (): Holding[] => {
  return [
    {
      id: "1",
      symbol: "COMP",
      name: "Compound",
      value: 3622.49,
      profitLoss: 1582.31,
      profitLossPercent: 77.56,
      chartData: [2000, 2100, 2300, 2500, 2700, 2900, 3100, 3300, 3500, 3600, 3620, 3622],
      icon: getIconPath("COMP"),
    },
    {
      id: "2",
      symbol: "BTC",
      name: "Bitcoin",
      value: 1253.94,
      profitLoss: 441.19,
      profitLossPercent: 54.28,
      chartData: [800, 820, 880, 920, 980, 1050, 1100, 1150, 1200, 1230, 1250, 1253],
      icon: getIconPath("BTC"),
    },
    {
      id: "3",
      symbol: "AAVE",
      name: "Aave",
      value: 460.35,
      profitLoss: 132.1,
      profitLossPercent: 40.24,
      chartData: [300, 310, 330, 350, 370, 390, 410, 430, 445, 455, 460, 460.35],
      icon: getIconPath("AAVE"),
    },
    {
      id: "4",
      symbol: "DOGE",
      name: "Dogecoin",
      value: 420.69,
      profitLoss: 342.82,
      profitLossPercent: 440.25,
      chartData: [50, 70, 100, 150, 200, 250, 300, 350, 380, 400, 415, 420],
      icon: getIconPath("DOGE"),
    },
    {
      id: "5",
      symbol: "UNI",
      name: "Uniswap",
      value: 285.32,
      profitLoss: -59.24,
      profitLossPercent: -28.75,
      chartData: [350, 345, 340, 335, 330, 325, 315, 305, 295, 290, 287, 285],
      icon: getIconPath("UNI"),
    },
  ];
};

export const getWatchlist = (): WatchlistItem[] => {
  return [
    {
      id: "1",
      symbol: "ETH",
      price: 2692.98,
      change24h: 1.26,
      chartData: [2620, 2650, 2635, 2670, 2655, 2680, 2665, 2690, 2685, 2692, 2695, 2692],
      icon: getIconPath("ETH"),
    },
    {
      id: "2",
      symbol: "LTC",
      price: 357.82,
      change24h: 3.76,
      chartData: [345, 350, 348, 352, 355, 353, 357, 356, 358, 357, 358, 357.82],
      icon: getIconPath("LTC"),
    },
    {
      id: "3",
      symbol: "COMP",
      price: 821.12,
      change24h: 0.64,
      chartData: [815, 818, 820, 819, 821, 820, 822, 821, 820, 821, 821.5, 821.12],
      icon: getIconPath("COMP"),
    },
    {
      id: "4",
      symbol: "GRT",
      price: 1.76,
      change24h: -3.12,
      chartData: [1.82, 1.80, 1.81, 1.79, 1.78, 1.77, 1.76, 1.75, 1.76, 1.75, 1.76, 1.76],
      icon: getIconPath("GRT"),
    },
    {
      id: "5",
      symbol: "DOGE",
      price: 0.1284,
      change24h: 4.2,
      chartData: [0.121, 0.123, 0.122, 0.125, 0.124, 0.126, 0.127, 0.128, 0.127, 0.128, 0.1285, 0.1284],
      icon: getIconPath("DOGE"),
    },
    {
      id: "6",
      symbol: "UNI",
      price: 52423.85,
      change24h: -14.87,
      chartData: [58000, 57000, 56000, 55000, 54500, 54000, 53500, 53000, 52800, 52600, 52500, 52423],
      icon: getIconPath("UNI"),
    },
  ];
};

export const getTransactions = (): Transaction[] => {
  return [
    {
      id: "1",
      symbol: "BTC",
      action: "Sell",
      date: "05/19/21",
      time: "14:33",
      units: 0.0029,
      price: 52423.85,
      total: 152.03,
      icon: getIconPath("BTC"),
    },
    {
      id: "2",
      symbol: "ETH",
      action: "Buy",
      date: "05/19/21",
      time: "09:51",
      units: 0.085,
      price: 2351.03,
      total: 200.0,
      icon: getIconPath("ETH"),
    },
    {
      id: "3",
      symbol: "ETH",
      action: "Buy",
      date: "05/16/21",
      time: "13:02",
      units: 0.0491,
      price: 2032.94,
      total: 100.0,
      icon: getIconPath("ETH"),
    },
    {
      id: "4",
      symbol: "UNI",
      action: "Sell",
      date: "05/15/21",
      time: "21:29",
      units: 15.5473,
      price: 36.21,
      total: 562.97,
      icon: getIconPath("UNI"),
    },
    {
      id: "5",
      symbol: "XTZ",
      action: "Buy",
      date: "05/13/21",
      time: "22:57",
      units: 19.5826,
      price: 4.72,
      total: 92.43,
      icon: getIconPath("XTZ"),
    },
  ];
};

