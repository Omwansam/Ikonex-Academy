import { NavLink } from 'react-router-dom';

export default function TabNav({ tabs, className = '' }) {
  return (
    <nav className={`flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm ${className}`}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export const RESULTS_TABS = [
  { label: 'Student Results', path: '/admin/results/students' },
  { label: 'Class Results', path: '/admin/results/class' },
  { label: 'Subject Results', path: '/admin/results/subjects' },
  { label: 'Rankings', path: '/admin/results/rankings' },
];

export const REPORTS_TABS = [
  { label: 'Report Cards', path: '/admin/reports/cards' },
  { label: 'Generate Reports', path: '/admin/reports/generate' },
  { label: 'Class Reports', path: '/admin/reports/class' },
];
