import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiLayers, FiClipboard, FiTrendingUp, FiPlus, FiUserPlus, FiFileText } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  PerformanceTrendChart, SubjectPerformanceChart, StreamDistributionChart, GradeDistributionChart,
} from '../../components/charts/Charts';
import { reportService } from '../../services/reportService';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, a, pt, sp, sd, gd] = await Promise.all([
          reportService.getDashboardStats(),
          reportService.getRecentActivities(),
          reportService.getPerformanceTrends(),
          reportService.getSubjectPerformance(),
          reportService.getStreamDistribution(),
          reportService.getGradeDistribution(),
        ]);
        setStats(s);
        setActivities(a);
        setCharts({ performanceTrends: pt, subjectPerformance: sp, streamDistribution: sd, gradeDistribution: gd });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <PageLoader />;

  const quickActions = [
    { label: 'Register Student', icon: FiUserPlus, path: '/admin/students/register', color: 'primary' },
    { label: 'Create Assessment', icon: FiPlus, path: '/admin/assessments/create', color: 'accent' },
    { label: 'Enter Scores', icon: FiClipboard, path: '/admin/assessments/scores', color: 'success' },
    { label: 'Generate Reports', icon: FiFileText, path: '/admin/reports/generate', color: 'warning' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Overview of Ikonex Academy" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Students" value={stats.totalStudents} icon={FiUsers} color="primary" trend={5.2} />
        <StatCard title="Total Subjects" value={stats.totalSubjects} icon={FiBook} color="accent" />
        <StatCard title="Class Streams" value={stats.totalStreams} icon={FiLayers} color="secondary" />
        <StatCard title="Assessments" value={stats.totalAssessments} icon={FiClipboard} color="warning" />
        <StatCard title="Avg Performance" value={`${stats.averagePerformance}%`} icon={FiTrendingUp} color="success" trend={3.1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceTrendChart data={charts.performanceTrends} />
        <SubjectPerformanceChart data={charts.subjectPerformance} />
        <StreamDistributionChart data={charts.streamDistribution} />
        <GradeDistributionChart data={charts.gradeDistribution} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader title="Recent Activities" subtitle="Latest system activities" />
          <div className="space-y-1">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary">{activity.action}</p>
                  <p className="text-sm text-text-secondary">{activity.detail}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-text-secondary">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader title="Quick Actions" subtitle="Common tasks" />
          <div className="grid gap-2">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Button variant="outline" className="w-full justify-start py-3">
                  <action.icon /> {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
