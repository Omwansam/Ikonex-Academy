import { GRADE_COLORS } from '../../utils/constants';

const statusColors = {
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Graduated: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Suspended: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Partial: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Pending: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Present: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Absent: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Late: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Graded: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Upcoming: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
};

const variantColors = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  primary: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  accent: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
};

export default function Badge({ children, variant, className = '', size = 'md' }) {
  const gradeStyle = GRADE_COLORS[children];
  const statusStyle = statusColors[children];
  const sizes = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs' };

  let style = 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
  if (gradeStyle) style = `${gradeStyle.bg} ${gradeStyle.text} ring-1 ${gradeStyle.border}`;
  else if (statusStyle) style = statusStyle;
  else if (variant && variantColors[variant]) style = variantColors[variant];

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizes[size]} ${style} ${className}`}>
      {children}
    </span>
  );
}
