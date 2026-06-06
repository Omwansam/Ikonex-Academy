import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-text-primary shadow-sm transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

export function FilterBar({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">{children}</div>
    </div>
  );
}
