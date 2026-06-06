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
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={ADMIN_NAV}
        collapsed={!isMobile && collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} notificationsPath="/admin/notifications" />
        <main className="app-main flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="page-enter mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
