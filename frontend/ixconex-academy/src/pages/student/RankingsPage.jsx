import { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/ui/StatCard';
import { FiAward, FiTrendingUp } from 'react-icons/fi';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { useAuth } from '../../context/AuthContext';
import { studentPortalService } from '../../services/studentPortalService';
import { getPositionSuffix } from '../../utils/grades';

export default function StudentRankingsPage() {
  const studentId = useStudentId();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getRankings(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const columns = [
    {
      key: 'position', label: 'Rank',
      render: (r) => (
        <span className={`font-bold ${r.studentId === studentId ? 'text-primary' : ''}`}>
          #{r.position}
        </span>
      ),
    },
    {
      key: 'name', label: 'Student',
      render: (r) => (
        <span className={r.studentId === studentId ? 'font-semibold text-primary' : ''}>
          {r.name} {r.studentId === studentId && '(You)'}
        </span>
      ),
    },
    { key: 'admissionNumber', label: 'Adm No.' },
    { key: 'totalMarks', label: 'Total Marks' },
    { key: 'average', label: 'Average %' },
  ];

  return (
    <div>
      <PageHeader title="Class Rankings" subtitle="See how you compare with classmates" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Rankings' }]} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Your Class Position"
          value={data.myRank ? getPositionSuffix(data.myRank.position) : '—'}
          icon={FiAward}
          color="accent"
        />
        <StatCard
          title="Your Average"
          value={data.myRank ? `${data.myRank.average}%` : '—'}
          icon={FiTrendingUp}
          color="success"
        />
      </div>

      {data.myRank && (
        <Card className="mb-6 border border-primary/20 bg-blue-50/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary">Your ranking in {data.myRank.stream}</p>
              <p className="text-2xl font-bold text-primary">{getPositionSuffix(data.myRank.position)} out of {data.classRankings.length || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Total Marks</p>
              <p className="text-xl font-bold">{data.myRank.totalMarks}</p>
            </div>
            <Badge variant="primary">{user?.name || user?.admissionNumber}</Badge>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader title="Class Leaderboard" subtitle={data.classRankings[0]?.stream || 'Your class'} />
        <DataTable columns={columns} data={data.classRankings.length ? data.classRankings : data.overallRankings} />
      </Card>

      <Card>
        <CardHeader title="School Top Performers" subtitle="Overall rankings" />
        <DataTable columns={columns} data={data.overallRankings} />
      </Card>
    </div>
  );
}
