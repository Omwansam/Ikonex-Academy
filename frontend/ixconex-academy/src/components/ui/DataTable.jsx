import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import Card from './Card';

export default function DataTable({ columns, data, loading, emptyTitle, emptyDescription, onRowClick, title }) {
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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {title && (
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <h3 className="font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">
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
                  <td key={col.key} className="whitespace-nowrap px-5 py-4 text-text-primary">
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
