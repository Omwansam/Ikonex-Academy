export default function EmptyState({ icon: Icon, title = 'No data found', description, action, actionLabel, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-inner">
        {Icon ? <Icon className="h-9 w-9 text-text-secondary" /> : (
          <svg className="h-9 w-9 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>}
      {action && actionLabel && (
        <button type="button" onClick={action} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
