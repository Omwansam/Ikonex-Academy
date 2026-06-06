import { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import { FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { formatDate } from '../../utils/formatters';

const statusVariant = { Paid: 'success', Partial: 'warning', Pending: 'danger' };

export default function StudentFeesPage() {
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getFees(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const columns = [
    { key: 'term', label: 'Term' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', render: (r) => `KES ${r.amount.toLocaleString()}` },
    { key: 'paid', label: 'Paid', render: (r) => `KES ${r.paid.toLocaleString()}` },
    { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fees & Payments" subtitle="View your fee statements and payment status" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Fees' }]} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Fees" value={`KES ${data.summary.totalDue.toLocaleString()}`} icon={FiDollarSign} color="primary" />
        <StatCard title="Amount Paid" value={`KES ${data.summary.totalPaid.toLocaleString()}`} icon={FiCheckCircle} color="success" />
        <StatCard title="Outstanding Balance" value={`KES ${data.summary.balance.toLocaleString()}`} icon={FiAlertCircle} color={data.summary.balance > 0 ? 'warning' : 'success'} />
      </div>

      {data.summary.balance > 0 && (
        <Card variant="flat" className="border-l-4 border-l-amber-500 bg-amber-50/50">
          <p className="text-sm font-medium leading-relaxed text-amber-900">
            You have an outstanding balance of KES {data.summary.balance.toLocaleString()}. Please contact the accounts office to arrange payment.
          </p>
        </Card>
      )}

      <Card variant="elevated">
        <CardHeader title="Fee Statement" subtitle="All fee records for the academic year" />
        <DataTable columns={columns} data={data.fees} emptyTitle="No fee records found" />
      </Card>
    </div>
  );
}
