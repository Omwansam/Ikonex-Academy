import { useEffect, useState } from 'react';
import { FiAward, FiBook, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import { GradeSummary } from '../../components/student/StudentWidgets';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { getPositionSuffix } from '../../utils/grades';

export default function StudentResultsPage() {
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getResults(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { results, summary, term } = data;

  const columns = [
    { key: 'subjectName', label: 'Subject' },
    { key: 'cat', label: 'CAT' },
    { key: 'exam', label: 'Exam' },
    { key: 'total', label: 'Total', render: (r) => <span className="font-semibold">{r.total}</span> },
    { key: 'maxTotal', label: 'Out Of' },
    { key: 'percentage', label: '%', render: (r) => `${Math.round((r.total / r.maxTotal) * 100)}%` },
    { key: 'grade', label: 'Grade', render: (r) => <Badge>{r.grade}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Results" subtitle={`${term} examination results`} breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Results' }]} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Marks" value={summary.total} icon={FiBook} color="primary" subtitle={`of ${summary.maxTotal}`} />
        <StatCard title="Average" value={`${summary.average}%`} icon={FiTrendingUp} color="success" />
        <StatCard title="Class Position" value={summary.position ? getPositionSuffix(summary.position) : '—'} icon={FiAward} color="accent" />
        <StatCard title="Subjects" value={results.length} icon={FiBook} color="secondary" />
      </div>

      <Card variant="elevated">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-secondary">Grade Distribution</h3>
        <GradeSummary gradeCounts={summary.gradeCounts} />
      </Card>

      <DataTable columns={columns} data={results} emptyTitle="No results available yet" />
    </div>
  );
}
