import { Link } from 'react-router-dom';

export default function QuickLinks({ links }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-sm transition-all duration-300 active:scale-[0.98] sm:gap-3 sm:p-5 sm:hover:-translate-y-1 sm:hover:border-primary/20 sm:hover:shadow-lg"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform sm:h-12 sm:w-12 sm:rounded-2xl sm:group-hover:scale-110 ${link.color || 'bg-blue-50 text-primary'}`}>
            <link.icon size={20} className="sm:hidden" />
            <link.icon size={22} className="hidden sm:block" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-text-primary sm:text-xs">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function GradeSummary({ gradeCounts }) {
  const grades = ['A', 'B', 'C', 'D', 'E'];
  const colors = { A: 'from-green-500 to-emerald-400', B: 'from-blue-500 to-indigo-400', C: 'from-amber-500 to-yellow-400', D: 'from-orange-500 to-amber-400', E: 'from-red-500 to-rose-400' };
  return (
    <div className="flex flex-wrap gap-3">
      {grades.map((g) => (
        <div key={g} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[g]} text-sm font-bold text-white shadow-md`}>
            {g}
          </div>
          <div>
            <p className="text-xs text-text-secondary">Grade {g}</p>
            <p className="text-lg font-bold text-text-primary">{gradeCounts?.[g] || 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
