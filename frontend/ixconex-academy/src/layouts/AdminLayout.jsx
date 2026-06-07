import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import { ADMIN_NAV } from '../utils/constants';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <Sidebar
        navItems={ADMIN_NAV}
        collapsed={!isMobile && collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} notificationsPath="/admin/notifications" />
        <main className="app-main flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-8 safe-bottom">
          <div className="page-enter mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
