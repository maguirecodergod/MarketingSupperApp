import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Spinner } from '../components/Input.js';
import { EmptyState, ErrorState } from '../components/States.js';
import { Button } from '../components/Button.js';

export interface Column<TData> {
  id: string;
  header: string | React.ReactNode | ((props: { isAllSelected: boolean; onToggleAll: () => void }) => React.ReactNode);
  accessorKey?: keyof TData;
  cell?: (props: { row: { original: TData; isSelected: boolean; toggleSelected: () => void } }) => React.ReactNode;
  size?: number;
  enableSorting?: boolean;
}

export interface EnterpriseDataGridProps<TData> {
  data: TData[];
  columns: Column<TData>[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  loading?: boolean;
  error?: Error | null;
  density?: 'compact' | 'comfortable';
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onRetry?: () => void;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getRowId?: (row: TData) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  fetchingLabel?: string;
  totalLabel?: string;
  rowsPerPageLabel?: string;
  pageOfLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function EnterpriseDataGrid<TData>({
  data,
  columns,
  totalCount = 0,
  page = 1,
  pageSize = 25,
  totalPages = 1,
  loading = false,
  error = null,
  density = 'comfortable',
  onPageChange,
  onPageSizeChange,
  onSortChange,
  sortBy,
  sortDir,
  onRetry,
  rowSelection = {},
  onRowSelectionChange,
  getRowId = (row: any) => row.id || String(row),
  emptyTitle = 'No records found',
  emptyDescription = 'No data matches the current filter criteria.',
  fetchingLabel = 'Fetching records...',
  totalLabel = 'Total:',
  rowsPerPageLabel = 'Rows per page:',
  pageOfLabel,
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: EnterpriseDataGridProps<TData>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowHeight = density === 'compact' ? 40 : 52;

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  const isAllSelected = data.length > 0 && data.every((row) => rowSelection[getRowId(row)]);

  const toggleAll = () => {
    if (!onRowSelectionChange) return;
    if (isAllSelected) {
      onRowSelectionChange({});
    } else {
      const next: Record<string, boolean> = {};
      for (const row of data) {
        next[getRowId(row)] = true;
      }
      onRowSelectionChange(next);
    }
  };

  const toggleRow = (id: string) => {
    if (!onRowSelectionChange) return;
    onRowSelectionChange((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Table Container with Virtualization */}
      <div ref={parentRef} className="h-[520px] overflow-auto relative">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            <tr>
              {columns.map((col) => {
                const canSort = col.enableSorting !== false && Boolean(col.accessorKey);
                const isSorted = sortBy === (col.accessorKey || col.id);

                return (
                  <th
                    key={col.id}
                    className="px-4 py-3 select-none"
                    style={{ width: col.size ? `${col.size}px` : undefined }}
                  >
                    <div
                      className={`flex items-center gap-1.5 ${
                        canSort && onSortChange ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white' : ''
                      }`}
                      onClick={() => {
                        if (canSort && onSortChange) {
                          const targetKey = String(col.accessorKey || col.id);
                          const nextDir = isSorted && sortDir === 'asc' ? 'desc' : 'asc';
                          onSortChange(targetKey, nextDir);
                        }
                      }}
                    >
                      {typeof col.header === 'function'
                        ? col.header({ isAllSelected, onToggleAll: toggleAll })
                        : col.header}
                      {isSorted && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {sortDir === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Spinner size="default" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{fetchingLabel}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = data[virtualRow.index];
                if (!row) return null;
                const rowId = getRowId(row);
                const isSelected = Boolean(rowSelection[rowId]);

                return (
                  <tr
                    key={rowId}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors ${
                      isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                    }`}
                    style={{
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    {columns.map((col) => {
                      return (
                        <td
                          key={col.id}
                          className={`px-4 text-gray-800 dark:text-gray-200 ${
                            density === 'compact' ? 'py-1.5' : 'py-2.5'
                          }`}
                        >
                          {col.cell
                            ? col.cell({
                                row: {
                                  original: row,
                                  isSelected,
                                  toggleSelected: () => toggleRow(rowId),
                                },
                              })
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? '')
                            : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <span>
            {totalLabel} <strong>{totalCount}</strong>
          </span>
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span>{rowsPerPageLabel}</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>
            {pageOfLabel || `Page ${page} of ${totalPages || 1}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            {prevLabel}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
