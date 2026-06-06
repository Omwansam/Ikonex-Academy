export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select...',
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
      <select
        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-text-primary shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:bg-slate-50 ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
