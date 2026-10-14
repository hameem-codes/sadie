import React from 'react';
import { FolderSearch } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
  tableLayout?: 'auto' | 'fixed';
}

/**
 * Table component
 * Editorial clinical registry table with subtle hairline dividers,
 * responsive scroll wrappers, skeleton loading, and styled empty states.
 */
export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtitle = 'Adjust your search filters or initiate a new case evaluation.',
  tableLayout = 'auto'
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full space-y-2 py-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full rounded-md bg-surface/60 animate-pulse border border-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border-hairline bg-surface/40 custom-scrollbar">
      <table className={`w-full min-w-[960px] ${tableLayout === 'fixed' ? 'table-fixed' : ''} text-left border-collapse`}>
        <thead>
          <tr className="border-b border-border-hairline bg-surface/80 text-secondary text-xs uppercase tracking-wider">
            {columns.map(col => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3.5 px-3 sm:px-3.5 font-semibold text-[13px] text-muted tracking-wider ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-full bg-elevated/80 border border-white/10 text-muted">
                    <FolderSearch className="w-5 h-5 text-muted" />
                  </div>
                  <p className="text-base font-medium text-white">{emptyMessage}</p>
                  <p className="text-sm text-muted max-w-sm">{emptySubtitle}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  style={{
                    animationDelay: `${Math.min(index * 35, 350)}ms`,
                    zIndex: data.length - index
                  }}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`group transition-colors duration-150 animate-drop-down relative ${
                    onRowClick ? 'cursor-pointer hover:bg-elevated/80' : 'hover:bg-surface/60'
                  }`}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`py-4 px-3 sm:px-3.5 text-[15px] leading-snug text-primary/95 font-sans ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
