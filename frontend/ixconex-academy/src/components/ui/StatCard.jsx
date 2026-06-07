const palettes = {
  primary: { icon: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30', accent: 'from-blue-500/5 to-transparent' },
  accent: { icon: 'bg-teal-500 text-white shadow-lg shadow-teal-500/30', accent: 'from-teal-500/5 to-transparent' },
  success: { icon: 'bg-green-500 text-white shadow-lg shadow-green-500/30', accent: 'from-green-500/5 to-transparent' },
  warning: { icon: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30', accent: 'from-amber-500/5 to-transparent' },
  danger: { icon: 'bg-red-500 text-white shadow-lg shadow-red-500/30', accent: 'from-red-500/5 to-transparent' },
  secondary: { icon: 'bg-slate-600 text-white shadow-lg shadow-slate-600/30', accent: 'from-slate-500/5 to-transparent' },
};

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, subtitle, color = 'primary', className = '' }) {
  const palette = palettes[color] || palettes.primary;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 sm:p-5 hover:shadow-lg ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${palette.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{value}</p>
          {subtitle && <p className="mt-1 text-xs font-medium text-text-secondary">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'vs last term'}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${palette.icon}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
