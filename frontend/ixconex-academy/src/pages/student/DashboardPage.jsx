import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook, FiTrendingUp, FiAward, FiLayers, FiCheckCircle,
  FiClipboard, FiFileText, FiBell, FiCalendar, FiDollarSign,
} from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QuickLinks from '../../components/student/StudentWidgets';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { StudentPerformanceChart, SubjectScoresChart } from '../../components/charts/Charts';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { formatDate } from '../../utils/formatters';

const quickLinks = [
  { label: 'My Results', path: '/student/results', icon: FiTrendingUp, color: 'bg-green-50 text-success' },
  { label: 'Assessments', path: '/student/assessments', icon: FiClipboard, color: 'bg-blue-50 text-primary' },
  { label: 'Timetable', path: '/student/timetable', icon: FiCalendar, color: 'bg-teal-50 text-accent' },
  { label: 'Report Card', path: '/student/reports', icon: FiFileText, color: 'bg-yellow-50 text-warning' },
  { label: 'Fees', path: '/student/fees', icon: FiDollarSign, color: 'bg-red-50 text-danger' },
  { label: 'Rankings', path: '/student/rankings', icon: FiAward, color: 'bg-purple-50 text-purple-600' },
  { label: 'Attendance', path: '/student/attendance', icon: FiCheckCircle, color: 'bg-green-50 text-success' },
  { label: 'Subjects', path: '/student/subjects', icon: FiBook, color: 'bg-slate-100 text-secondary' },
];

export default function StudentDashboardPage() {
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getDashboard(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { student, stats, results, upcomingAssessments, performanceTrend, notifications, recentEvents, term } = data;
  const subjectScores = results.map((r) => ({
    subject: r.subjectName,
    score: Math.round((r.total / r.maxTotal) * 100),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${student.firstName}!`}
        subtitle={`${student.streamName} · ${term} · ${student.admissionNumber}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Current Class" value={stats.className} icon={FiLayers} color="primary" />
        <StatCard title="Average Score" value={`${stats.average}%`} icon={FiTrendingUp} color="success" />
        <StatCard title="Class Position" value={stats.position !== '—' ? `#${stats.position}` : '—'} icon={FiAward} color="accent" />
        <StatCard title="Subjects" value={stats.subjectsCount} icon={FiBook} color="secondary" />
        <StatCard title="Attendance" value={`${stats.attendanceRate}%`} icon={FiCheckCircle} color="success" />
        <StatCard title="Fee Balance" value={`KES ${stats.feeBalance.toLocaleString()}`} icon={FiDollarSign} color={stats.feeBalance > 0 ? 'warning' : 'success'} />
      </div>

      <Card variant="elevated">
        <CardHeader title="Quick Access" subtitle="Jump to your most used pages" />
        <QuickLinks links={quickLinks} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader
            title="Upcoming Assessments"
            action={<Link to="/student/assessments"><Button variant="ghost" size="sm">View all</Button></Link>}
          />
          {upcomingAssessments.length === 0 ? (
            <p className="text-sm text-text-secondary">No upcoming assessments scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAssessments.map((a) => (
                <div key={a.assessmentId} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-text-primary">{a.title}</p>
                    <p className="text-sm text-text-secondary">{a.subjectName} · {a.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning">Upcoming</Badge>
                    <p className="mt-1 text-xs font-medium text-text-secondary">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card variant="elevated">
          <CardHeader
            title="Notifications"
            action={<Link to="/student/notifications"><Button variant="ghost" size="sm"><FiBell /></Button></Link>}
          />
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={`rounded-xl p-3 transition-colors ${!n.read ? 'border border-blue-100 bg-blue-50/80' : 'bg-slate-50'}`}>
                <p className="text-sm font-semibold text-text-primary">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">{n.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentPerformanceChart data={performanceTrend.map((p) => ({ term: p.term, score: p.score }))} title="My Performance Trend" />
        <SubjectScoresChart data={subjectScores} title="Subject Scores" />
      </div>

      <Card variant="elevated">
        <CardHeader title="Upcoming Events" action={<Link to="/student/calendar"><Button variant="ghost" size="sm">View calendar</Button></Link>} />
        <div className="grid gap-3 sm:grid-cols-3">
          {recentEvents.map((e) => (
            <div key={e.id} className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 transition-all hover:shadow-md">
              <Badge variant="primary" className="capitalize">{e.type}</Badge>
              <p className="mt-2 font-semibold text-text-primary">{e.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{formatDate(e.date)} · {e.time}</p>
              <p className="text-xs text-text-secondary">{e.location}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
