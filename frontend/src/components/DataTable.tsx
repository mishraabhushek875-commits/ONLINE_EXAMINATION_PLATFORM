"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (row: T) => string;
  pageSize?: number;
  emptyLabel?: string;
  isLoading?: boolean;
}

export default function DataTable<T>({
  data,
  columns,
  searchKeys,
  pageSize = 8,
  emptyLabel = "No records found.",
  isLoading,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query || !searchKeys) return data;
    const q = query.toLowerCase();
    return data.filter((row) => searchKeys(row).toLowerCase().includes(q));
  }, [data, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card">
      {searchKeys && (
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-3">
          <Search size={16} className="text-ink-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500">
              {columns.map((col) => (
                <th key={col.header} className="px-5 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-ink-400">
                  Loading...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-ink-400">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={i} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                  {columns.map((col) => (
                    <td key={col.header} className={`px-5 py-3.5 text-ink-700 ${col.className || ""}`}>
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 text-sm text-ink-500">
          <span>
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-1.5 hover:bg-ink-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-1.5 hover:bg-ink-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
