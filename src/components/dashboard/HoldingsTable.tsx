import React, { useState } from "react";
import { Holding } from "../../services/dashboard.service";
import MiniChart from "./MiniChart";
import { formatCurrency, formatPercent } from "../../utils/formatters";

interface HoldingsTableProps {
  holdings: Holding[];
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(holdings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHoldings = holdings.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">My holdings</h2>
        <button
          type="button"
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={() => {}}
          aria-label="View all holdings"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">
                Cryptocurrency
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                Value
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                P/L ($)
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                P/L (%)
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                Chart
              </th>
            </tr>
          </thead>
          <tbody>
            {currentHoldings.map((holding) => (
              <tr
                key={holding.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {holding.icon && (
                      <img 
                        src={holding.icon} 
                        alt={holding.name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {holding.name}
                      </span>
                      <span className="text-sm text-white/60">
                        {holding.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-white">
                  {formatCurrency(holding.value)}
                </td>
                <td
                  className={`text-right py-4 px-4 ${
                    holding.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(holding.profitLoss)}
                </td>
                <td
                  className={`text-right py-4 px-4 ${
                    holding.profitLossPercent >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(holding.profitLossPercent)}
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex justify-end">
                    <MiniChart
                      data={holding.chartData}
                      isPositive={holding.profitLossPercent >= 0}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-white/70">
        <div>
          <span>Items per page {itemsPerPage}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {startIndex + 1}-{Math.min(endIndex, holdings.length)} of{" "}
            {holdings.length}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;

