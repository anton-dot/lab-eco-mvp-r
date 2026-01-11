import React from "react";
import { WatchlistItem } from "../../services/dashboard.service";
import MiniChart from "./MiniChart";
import { formatPercent } from "../../utils/formatters";

interface WatchlistCardProps {
  item: WatchlistItem;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ item }) => {
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {item.icon && (
            <img 
              src={item.icon} 
              alt={item.symbol}
              className="w-5 h-5 object-contain"
            />
          )}
          <span className="text-lg font-semibold text-white">{item.symbol}</span>
        </div>
        <span
          className={`text-sm ${
            item.change24h >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatPercent(item.change24h)}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-3">
        {formatPrice(item.price)}
      </div>
      <div className="text-xs text-white/60 mb-2">24H</div>
      <div className="h-12">
        <MiniChart
          data={item.chartData}
          isPositive={item.change24h >= 0}
          width={120}
          height={48}
        />
      </div>
    </div>
  );
};

export default WatchlistCard;

