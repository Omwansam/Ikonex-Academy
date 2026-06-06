export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-primary`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium text-text-secondary">Loading...</p>
    </div>
  );
}

export function Skeleton({ className = 'h-4 w-full rounded-lg' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-4 h-4 w-1/3" />
      <Skeleton className="mb-2 h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
