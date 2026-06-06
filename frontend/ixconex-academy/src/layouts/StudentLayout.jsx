import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import { STUDENT_NAV } from '../utils/constants';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={STUDENT_NAV}
        collapsed={!isMobile && collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} notificationsPath="/student/notifications" />
        <main className="app-main flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="page-enter mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
