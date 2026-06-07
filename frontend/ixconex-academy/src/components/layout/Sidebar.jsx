import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiBook, FiLayers, FiClipboard, FiBarChart2,
  FiFileText, FiUser, FiLogOut, FiChevronLeft, FiChevronRight, FiX,
  FiUserCheck, FiCalendar, FiBell, FiSettings, FiClock, FiAward,
  FiDollarSign, FiCheckCircle,
} from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  dashboard: FiGrid,
  streams: FiLayers,
  students: FiUsers,
  teachers: FiUserCheck,
  subjects: FiBook,
  assessments: FiClipboard,
  attendance: FiCheckCircle,
  timetable: FiClock,
  rankings: FiAward,
  fees: FiDollarSign,
  calendar: FiCalendar,
  results: FiBarChart2,
  reports: FiFileText,
  notifications: FiBell,
  settings: FiSettings,
  profile: FiUser,
};

export default function Sidebar({ navItems, collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    if (path === '/admin' || path === '/student') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-4">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-white shadow-lg shadow-primary/30">
              IK
            </div>
            <div>
              <p className="text-sm font-bold text-white">{APP_NAME}</p>
              <p className="text-[11px] font-medium text-slate-400">Management System</p>
            </div>
          </Link>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-white">
            IK
          </div>
        )}
        <button type="button" onClick={onMobileClose} className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden">
          <FiX size={20} />
        </button>
      </div>

      {!collapsed && user && (
        <div className="border-b border-white/10 px-4 py-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold text-white">{user.name || user.admissionNumber}</p>
            <p className="mt-0.5 text-xs capitalize text-slate-400">{user.role} Portal</p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || FiGrid;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={19} className={`shrink-0 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-1">
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white lg:flex ${collapsed ? 'justify-center' : ''}`}
          >
            {collapsed ? <FiChevronRight size={19} /> : <FiChevronLeft size={19} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        <button
          type="button"
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
        >
          <FiLogOut size={19} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col bg-gradient-to-b from-secondary to-slate-900 shadow-2xl transition-all duration-300 lg:static lg:max-w-none lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed && !mobileOpen ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
