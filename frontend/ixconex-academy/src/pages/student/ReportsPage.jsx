import { useEffect, useState } from 'react';
import { FiPrinter } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import ReportCardPrint from '../../components/cards/ReportCardPrint';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';

export default function StudentReportsPage() {
  const studentId = useStudentId();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getReportCard(studentId).then(setReport).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="My Report Card" subtitle="Term 1 academic report" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Reports' }]}>
        <Button variant="outline" onClick={() => window.print()}><FiPrinter /> Print</Button>
      </PageHeader>

      <Card className="mb-6 no-print">
        <p className="text-sm text-text-secondary">
          Your official report card for the current term. Use the print button to save or print a copy for your records.
        </p>
      </Card>

      {report ? (
        <ReportCardPrint report={report} />
      ) : (
        <Card><p className="py-8 text-center text-text-secondary">Report card not available yet.</p></Card>
      )}
    </div>
  );
}
