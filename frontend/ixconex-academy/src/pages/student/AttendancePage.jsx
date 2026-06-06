import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { attendanceService } from '../../services/attendanceService';
import { formatDate } from '../../utils/formatters';

const statusVariant = { Present: 'success', Absent: 'danger', Late: 'warning' };

export default function StudentAttendancePage() {
  const studentId = useStudentId();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    attendanceService.getStudentSummary(studentId).then(setSummary).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Track your school attendance record" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Attendance' }]} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance Rate" value={`${summary?.rate || 0}%`} icon={FiCheckCircle} color="success" />
        <StatCard title="Days Present" value={summary?.present || 0} icon={FiCheckCircle} color="primary" />
        <StatCard title="Days Absent" value={summary?.absent || 0} icon={FiXCircle} color="danger" />
        <StatCard title="Days Late" value={summary?.late || 0} icon={FiClock} color="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Attendance Overview" />
          <div className="space-y-4">
            {['Present', 'Absent', 'Late'].map((status) => {
              const count = summary?.[status.toLowerCase()] || 0;
              const total = summary?.total || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text-secondary">{status}</span>
                    <span className="font-medium">{count} days ({pct}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${status === 'Present' ? 'bg-success' : status === 'Absent' ? 'bg-danger' : 'bg-warning'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Records" />
          <div className="space-y-3">
            {summary?.records?.length ? summary.records.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-text-primary">{formatDate(r.date)}</span>
                <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
              </div>
            )) : (
              <p className="text-sm text-text-secondary">No attendance records yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
