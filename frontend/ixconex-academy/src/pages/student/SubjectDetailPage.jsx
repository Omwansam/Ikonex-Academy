import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { formatDate } from '../../utils/formatters';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId || !id) return;
    studentPortalService.getSubjectDetail(studentId, id).then(setData).finally(() => setLoading(false));
  }, [studentId, id]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { subject, result, assessments } = data;

  const columns = [
    { key: 'title', label: 'Assessment' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant="primary">{r.type}</Badge> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'score', label: 'Score',
      render: (r) => r.score != null ? `${r.score}/${r.maxScore}` : '—',
    },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Graded' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  return (
    <div>
      <Link to="/student/subjects" className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary">
        <FiArrowLeft size={16} /> Back to subjects
      </Link>

      <PageHeader title={subject.name} subtitle={`${subject.code} · ${subject.description}`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FiUser /></div>
            <div>
              <p className="text-sm text-text-secondary">Teacher</p>
              <p className="font-semibold">{subject.teacher}</p>
            </div>
          </div>
        </Card>
        {result && (
          <>
            <Card><p className="text-sm text-text-secondary">Total Score</p><p className="text-2xl font-bold">{result.total}/{result.maxTotal}</p></Card>
            <Card><p className="text-sm text-text-secondary">Grade</p><p className="text-2xl font-bold"><Badge>{result.grade}</Badge></p></Card>
          </>
        )}
      </div>

      {result && (
        <Card className="mb-6">
          <CardHeader title="Score Breakdown" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 text-center"><p className="text-sm text-text-secondary">CAT</p><p className="text-xl font-bold">{result.cat}</p></div>
            <div className="rounded-xl bg-slate-50 p-4 text-center"><p className="text-sm text-text-secondary">Exam</p><p className="text-xl font-bold">{result.exam}</p></div>
            <div className="rounded-xl bg-slate-50 p-4 text-center"><p className="text-sm text-text-secondary">Total</p><p className="text-xl font-bold text-primary">{result.total}</p></div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="Assessments" subtitle="All assessments for this subject" />
        <DataTable columns={columns} data={assessments} emptyTitle="No assessments yet" />
      </Card>
    </div>
  );
}
