const variants = {
  primary: 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] focus:ring-primary',
  secondary: 'bg-secondary text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 focus:ring-secondary',
  accent: 'bg-accent text-white shadow-md shadow-accent/20 hover:bg-teal-600 focus:ring-accent',
  outline: 'border border-slate-200 bg-white text-text-primary shadow-sm hover:border-primary/30 hover:bg-slate-50 focus:ring-primary',
  danger: 'bg-danger text-white shadow-md shadow-danger/20 hover:bg-red-600 focus:ring-danger',
  ghost: 'text-text-secondary hover:bg-slate-100 hover:text-text-primary',
  success: 'bg-success text-white shadow-md shadow-success/20 hover:bg-green-600 focus:ring-success',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
