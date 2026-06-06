import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row">
      <p className="text-sm text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{start}</span>–
        <span className="font-semibold text-text-primary">{end}</span> of{' '}
        <span className="font-semibold text-text-primary">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <FiChevronLeft />
        </Button>
        <span className="min-w-[100px] text-center text-sm font-medium text-text-secondary">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
}
