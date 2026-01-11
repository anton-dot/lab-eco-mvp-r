import React, { useMemo, useState } from "react";

const rows = [
  {
    id: 1,
    user: "John",
    lmng: 100,
    winRate: 75,
    roundsWon: 10,
    roundsPlayed: 20,
  },
  {
    id: 2,
    user: "Jane",
    lmng: 200,
    winRate: 50,
    roundsWon: 5,
    roundsPlayed: 10,
  },
  {
    id: 3,
    user: "Bob",
    lmng: 150,
    winRate: 60,
    roundsWon: 12,
    roundsPlayed: 18,
  },
];

const columns = [
  { id: "id", label: "" },
  { id: "user", label: "User" },
  { id: "lmng", label: "Net Winnings (LMNG)" },
  { id: "winRate", label: "Win Rate" },
  { id: "roundsWon", label: "Rounds WON" },
  { id: "roundsPlayed", label: "Rounds Played" },
];

const rowsPerPageOptions = [5, 10, 25];

const WinnerTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagedRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl bg-[#283573]">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[linear-gradient(177deg,#414593_0%,#00022E_100.23%)]">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left font-poppins text-[1.22281rem] font-medium text-white first:rounded-tl-[0.95106rem] last:rounded-tr-[0.95106rem]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row: any) => (
              <tr key={row.id} className="odd:bg-white/0 even:bg-white/[0.02]">
                {columns.map((col, idx) => (
                  <td
                    key={`${row.id}-${col.id}`}
                    className="px-4 py-3 font-poppins text-base font-semibold text-white"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-[0.95106rem] bg-[linear-gradient(177deg,#414593_0%,#00022E_100.23%)]">
                      #{idx + 1}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-white">
          Rows per page:
          <select
            className="ml-2 rounded border border-white/20 bg-transparent px-2 py-1 text-white outline-none"
            value={rowsPerPage}
            onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } } as any)}
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0b0f2e]">
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            className="rounded border border-white/20 px-2 py-1 disabled:opacity-40"
            onClick={(e) => handleChangePage(e, page - 1)}
            disabled={page === 0}
          >
            Prev
          </button>
          <span>
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
          </span>
          <button
            type="button"
            className="rounded border border-white/20 px-2 py-1 disabled:opacity-40"
            onClick={(e) => handleChangePage(e, page + 1)}
            disabled={(page + 1) * rowsPerPage >= rows.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerTable;
