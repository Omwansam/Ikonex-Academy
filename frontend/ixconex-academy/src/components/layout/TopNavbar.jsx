import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

export default function TopNavbar({ onMenuClick, title, notificationsPath = '/admin/notifications' }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    notificationService.getUnreadCount({
      role: user.role,
      studentId: user.studentId,
    }).then(setUnreadCount);
  }, [user]);

  const roleLabel = user?.role === 'admin' ? 'Administrator' : 'Student';

  return (
    <header className="glass-nav sticky top-0 z-30 border-b border-slate-200/60 safe-top">
      <div className="flex h-14 min-h-[3.5rem] flex-col sm:h-16">
        <div className="flex h-full items-center justify-between gap-2 px-3 sm:px-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={onMenuClick}
              className="shrink-0 rounded-xl p-2 text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary lg:hidden"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            {title && (
              <h1 className="truncate text-base font-bold text-text-primary sm:text-lg lg:hidden">
                {title}
              </h1>
            )}
          </div>

          <div className="hidden max-w-lg flex-1 px-4 md:block lg:px-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                placeholder="Search students, subjects, reports..."
                className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-2.5 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-slate-100 hover:text-primary md:hidden"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

            <Link
              to={notificationsPath}
              className="relative rounded-xl p-2 text-text-secondary transition-all hover:bg-slate-100 hover:text-primary"
              aria-label="Notifications"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="flex max-w-[160px] items-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-1 pl-1 pr-2 shadow-sm sm:max-w-none sm:gap-3 sm:py-1.5 sm:pl-1.5 sm:pr-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-xs font-bold text-white shadow-md shadow-primary/25 sm:h-9 sm:w-9 sm:text-sm">
                {user?.name?.[0] || user?.admissionNumber?.[0] || 'U'}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-[120px] truncate text-sm font-semibold text-text-primary lg:max-w-[140px]">
                  {user?.name || user?.admissionNumber || 'User'}
                </p>
                <p className="text-xs font-medium text-text-secondary">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-slate-100 px-3 pb-3 pt-2 md:hidden">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                autoFocus
                placeholder="Search..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
