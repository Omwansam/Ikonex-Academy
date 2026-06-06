export default function Input({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          {label}
          {props.required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-text-primary shadow-sm transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:bg-slate-50 disabled:opacity-60 ${error ? 'border-danger focus:border-danger focus:ring-danger/10' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
