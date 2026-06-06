import Breadcrumbs from './Breadcrumbs';
import Button from '../ui/Button';

export default function PageHeader({ title, subtitle, breadcrumbs = [], action, actionLabel, onAction, children, badge }) {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">{subtitle}</p>}
        </div>
        {(children || actionLabel) && (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {children}
            {actionLabel && (
              <Button onClick={onAction || action}>{actionLabel}</Button>
            )}
          </div>
        )}
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-slate-200 to-transparent" />
    </div>
  );
}
