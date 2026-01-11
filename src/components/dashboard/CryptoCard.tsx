import React from "react";
import { CryptoCardData } from "../../services/dashboard.service";

interface CryptoCardProps {
  data: CryptoCardData;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  data,
}) => {
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}k`;
    }
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative flex items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full px-6 py-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        {data.id !== "total" && data.icon && (
          <div className="mb-2 absolute -top-8 bg-white rounded-full">
            <img 
              src={data.icon} 
              alt={data.name}
              className="w-16 h-16 object-contain"
            />
          </div>
        )}
        <div className="text-2xl font-semibold text-white mb-1 mt-8">
          {formatValue(data.value)}
        </div>
        <div className={`text-sm ${data.change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {data.changeText}
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;

