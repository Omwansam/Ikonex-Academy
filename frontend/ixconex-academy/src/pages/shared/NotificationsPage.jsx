import { useEffect, useState } from 'react';
import { FiBell, FiCheck, FiCheckCircle } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { formatDate } from '../../utils/formatters';

const typeStyles = {
  info: { badge: 'primary', border: 'border-l-blue-500', bg: 'bg-blue-50/50' },
  success: { badge: 'success', border: 'border-l-green-500', bg: 'bg-green-50/50' },
  warning: { badge: 'warning', border: 'border-l-amber-500', bg: 'bg-amber-50/50' },
  danger: { badge: 'danger', border: 'border-l-red-500', bg: 'bg-red-50/50' },
};

export default function NotificationsPage({ basePath = '/admin' }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await notificationService.getAll({ role: user?.role, studentId: user?.studentId });
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const markRead = async (id) => { await notificationService.markAsRead(id); load(); };
  const markAllRead = async () => {
    await notificationService.markAllAsRead({ role: user?.role, studentId: user?.studentId });
    load();
  };

  if (loading) return <PageLoader />;

  const unread = notifications.filter((n) => !n.read).length;
  const read = notifications.filter((n) => n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread message${unread > 1 ? 's' : ''}` : 'All caught up!'}
        breadcrumbs={[{ label: user?.role === 'admin' ? 'Admin' : 'Student', path: basePath }, { label: 'Notifications' }]}
      >
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}><FiCheck /> Mark all read</Button>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={notifications.length} icon={FiBell} color="primary" />
        <StatCard title="Unread" value={unread} icon={FiBell} color="warning" />
        <StatCard title="Read" value={read} icon={FiCheckCircle} color="success" />
      </div>

      {notifications.length === 0 ? (
        <Card variant="flat"><EmptyState icon={FiBell} title="No notifications" description="You're all caught up!" /></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const style = typeStyles[n.type] || typeStyles.info;
            return (
              <Card
                key={n.id}
                variant={n.read ? 'flat' : 'elevated'}
                className={`border-l-4 ${style.border} ${!n.read ? style.bg : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</h3>
                      <Badge variant={style.badge} size="sm">{n.type}</Badge>
                      {!n.read && <Badge variant="primary" size="sm">New</Badge>}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{n.message}</p>
                    <p className="mt-3 text-xs font-medium text-text-secondary">{formatDate(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>Mark read</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
