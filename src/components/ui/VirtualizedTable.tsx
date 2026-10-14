import { List } from 'react-window';
import { Column } from './Table';
import { FolderSearch } from 'lucide-react';

export interface VirtualizedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  rowHeight?: number;
  height?: number;
  emptyMessage?: string;
}

export function VirtualizedTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  rowHeight = 64,
  height = 540,
  emptyMessage = 'No records found'
}: VirtualizedTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-border-hairline bg-surface/40 p-12 text-center flex flex-col items-center justify-center space-y-2">
        <div className="p-3 rounded-full bg-elevated/80 border border-border-hairline text-muted">
          <FolderSearch className="w-5 h-5 text-muted" />
        </div>
        <p className="text-base font-medium text-primary">{emptyMessage}</p>
        <p className="text-sm text-secondary">Adjust your search filters to find relevant cases.</p>
      </div>
    );
  }

  const RowItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    if (!item) return null;
    const key = keyExtractor(item);

    return (
      <div
        key={key}
        style={style}
        onClick={() => onRowClick && onRowClick(item)}
        className={`flex items-center border-b border-border-hairline px-3 sm:px-3.5 transition-colors duration-150 ${
          onRowClick ? 'cursor-pointer hover:bg-elevated/80' : 'hover:bg-surface/60'
        }`}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            style={{ width: col.width || 'auto', flex: col.width ? 'none' : '1 1 0%' }}
            className={`py-2 text-[14px] leading-snug text-primary/95 font-sans overflow-hidden text-ellipsis ${
              col.align === 'right'
                ? 'text-right'
                : col.align === 'center'
                ? 'text-center'
                : 'text-left'
            } ${col.className || ''}`}
          >
            {col.render ? col.render(item) : (item as any)[col.key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border-hairline bg-surface/40 shadow-sm custom-scrollbar">
      <div className="min-w-[760px] sm:min-w-[960px]">
        {/* Fixed Table Header */}
        <div className="flex items-center border-b border-border-hairline bg-surface/80 px-3 sm:px-3.5 text-xs uppercase tracking-wider text-muted font-semibold">
          {columns.map((col) => (
            <div
              key={col.key}
              style={{ width: col.width || 'auto', flex: col.width ? 'none' : '1 1 0%' }}
              className={`py-3.5 ${
                col.align === 'right'
                  ? 'text-right'
                  : col.align === 'center'
                  ? 'text-center'
                  : 'text-left'
              } ${col.className || ''}`}
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Virtualized Scrolling Body */}
        <List
          style={{ height }}
          rowCount={data.length}
          rowHeight={rowHeight}
          rowProps={{}}
          rowComponent={RowItem as any}
          className="custom-scrollbar"
        />
      </div>
    </div>
  );
}
