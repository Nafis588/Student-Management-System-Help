import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Table<T>({
  columns,
  data,
  sortKey,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange
}: TableProps<T>) {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
      <div className="table-container">
        <table className="sms-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{col.label}</span>
                    {col.sortable && onSort && (
                      sortKey === col.key ? (
                        sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <ChevronsUpDown size={14} style={{ opacity: 0.4 }} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No records matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalRecords > 0 && (
        <div className="pagination">
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of <strong>{totalRecords}</strong> records
          </div>
          
          <div className="pagination-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rows:</span>
              <select 
                className="form-control" 
                style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.875rem', height: '32px' }}
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <button 
              className="pagination-btn" 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              className="pagination-btn" 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
