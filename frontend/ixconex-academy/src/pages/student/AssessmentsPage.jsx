import { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/ui/StatCard';
import { FiClipboard, FiCheckCircle, FiClock } from 'react-icons/fi';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { formatDate } from '../../utils/formatters';

export default function StudentAssessmentsPage() {
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getAssessments(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant="primary">{r.type}</Badge> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'score', label: 'Score',
      render: (r) => r.score != null ? `${r.score}/${r.maxScore}` : 'Pending',
    },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge variant={r.status === 'Graded' ? 'success' : 'warning'}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader title="My Assessments" subtitle="Upcoming and completed assessments" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Assessments' }]} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={data.all.length} icon={FiClipboard} color="primary" />
        <StatCard title="Graded" value={data.graded.length} icon={FiCheckCircle} color="success" />
        <StatCard title="Upcoming" value={data.upcoming.length} icon={FiClock} color="warning" />
      </div>

      {data.upcoming.length > 0 && (
        <Card className="mb-6">
          <CardHeader title="Upcoming" subtitle="Prepare for these assessments" />
          <DataTable columns={columns} data={data.upcoming} />
        </Card>
      )}

      <Card>
        <CardHeader title="Completed Assessments" />
        <DataTable columns={columns} data={data.graded} emptyTitle="No graded assessments yet" />
      </Card>
    </div>
  );
}
