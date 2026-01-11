import React, { useState } from "react";
import { Transaction } from "../../services/dashboard.service";
import { formatCurrency } from "../../utils/formatters";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const formatUnits = (units: number): string => {
    return units.toLocaleString("en-US", { maximumFractionDigits: 8 });
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        My transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">
                Cryptocurrency
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">
                Action
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">
                Date & Time
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                Units
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-white/70">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {transaction.icon && (
                      <img 
                        src={transaction.icon} 
                        alt={transaction.symbol}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span className="text-white font-medium">
                      {transaction.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      transaction.action === "Buy"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {transaction.action}
                  </span>
                </td>
                <td className="py-4 px-4 text-white/70">
                  {transaction.date} {transaction.time}
                </td>
                <td className="text-right py-4 px-4 text-white">
                  {formatUnits(transaction.units)}
                </td>
                <td className="text-right py-4 px-4 text-white">
                  {formatCurrency(transaction.price)}
                </td>
                <td className="text-right py-4 px-4 text-white font-medium">
                  {formatCurrency(transaction.total)}
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
            {startIndex + 1}-{Math.min(endIndex, transactions.length)} of{" "}
            {transactions.length}
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

export default TransactionsTable;

