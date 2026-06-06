import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm">
      <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary">
        <FiHome size={15} />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <FiChevronRight className="text-slate-300" size={14} />
          {item.path ? (
            <Link to={item.path} className="rounded-lg px-2 py-1 font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold text-text-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
