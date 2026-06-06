const variants = {
  default: 'border-slate-200/80 bg-white shadow-sm hover:shadow-md',
  elevated: 'border-slate-200/60 bg-white shadow-md hover:shadow-lg',
  flat: 'border-transparent bg-slate-50 shadow-none hover:bg-slate-100',
  accent: 'border-primary/10 bg-gradient-to-br from-white to-blue-50/50 shadow-sm',
};

export default function Card({ children, className = '', padding = true, variant = 'default', ...props }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${variants[variant]} ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '', badge }) {
  return (
    <div className={`mb-5 flex items-start justify-between gap-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          {title && <h3 className="text-lg font-bold tracking-tight text-text-primary">{title}</h3>}
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, children, action, className = '' }) {
  return (
    <Card variant="elevated" className={className}>
      {(title || subtitle) && <CardHeader title={title} subtitle={subtitle} action={action} />}
      {children}
    </Card>
  );
}
