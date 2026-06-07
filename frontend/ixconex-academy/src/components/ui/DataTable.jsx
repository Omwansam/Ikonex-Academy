import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import Card from './Card';
import { useIsMobile } from '../../hooks/useMediaQuery';

function MobileCard({ columns, row, onRowClick }) {
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);

  return (
    <div
      onClick={() => onRowClick?.(row)}
      className={`rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors ${
        onRowClick ? 'cursor-pointer active:bg-blue-50/40' : ''
      }`}
    >
      <dl className="space-y-2.5">
        {visibleColumns.map((col) => {
          const value = col.render ? col.render(row) : row[col.key];
          const isActions = col.key === 'actions';

          return (
            <div
              key={col.key}
              className={`flex gap-3 ${isActions ? 'mt-3 border-t border-slate-100 pt-3' : 'items-start justify-between'}`}
            >
              {!isActions && (
                <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {col.label}
                </dt>
              )}
              <dd className={`min-w-0 text-right text-sm text-text-primary ${isActions ? 'flex w-full justify-end gap-2' : ''}`}>
                {value ?? '—'}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function DataTable({
  columns,
  data,
  loading,
  emptyTitle,
  emptyDescription,
  onRowClick,
  title,
  forceMobileCards,
}) {
  const isMobile = useIsMobile();
  const showCards = forceMobileCards ?? isMobile;

  if (loading) {
    return (
      <Card variant="flat" className="py-16">
        <LoadingSpinner className="mx-auto" size="lg" />
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card variant="flat">
        <EmptyState title={emptyTitle || 'No records found'} description={emptyDescription} />
      </Card>
    );
  }

  if (showCards) {
    return (
      <div className="space-y-3">
        {title && <h3 className="px-1 text-sm font-semibold text-text-primary">{title}</h3>}
        {data.map((row, idx) => (
          <MobileCard key={row.id ?? idx} columns={columns} row={row} onRowClick={onRowClick} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {title && (
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="table-scroll overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary sm:px-5 sm:py-4 ${
                    col.hideOnMobile ? 'hidden lg:table-cell' : ''
                  } ${col.nowrap !== false ? 'whitespace-nowrap' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/40' : 'hover:bg-slate-50/50'}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-3 text-text-primary sm:px-5 sm:py-4 ${
                      col.hideOnMobile ? 'hidden lg:table-cell' : ''
                    } ${col.nowrap !== false ? 'whitespace-nowrap' : ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
