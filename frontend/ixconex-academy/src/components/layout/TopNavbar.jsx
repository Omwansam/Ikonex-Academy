import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

export default function TopNavbar({ onMenuClick, title, notificationsPath = '/admin/notifications' }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationService.getUnreadCount({
      role: user.role,
      studentId: user.studentId,
    }).then(setUnreadCount);
  }, [user]);

  const roleLabel = user?.role === 'admin' ? 'Administrator' : 'Student';

  return (
    <header className="glass-nav sticky top-0 z-30 border-b border-slate-200/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2.5 text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary lg:hidden"
          >
            <FiMenu size={20} />
          </button>
          {title && <h1 className="text-lg font-bold text-text-primary lg:hidden">{title}</h1>}
        </div>

        <div className="hidden max-w-lg flex-1 px-8 md:block">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search students, subjects, reports..."
              className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-2.5 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={notificationsPath}
            className="relative rounded-xl p-2.5 text-text-secondary transition-all hover:bg-slate-100 hover:text-primary"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-white shadow-md shadow-primary/25">
              {user?.name?.[0] || user?.admissionNumber?.[0] || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-text-primary">
                {user?.name || user?.admissionNumber || 'User'}
              </p>
              <p className="text-xs font-medium text-text-secondary">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
