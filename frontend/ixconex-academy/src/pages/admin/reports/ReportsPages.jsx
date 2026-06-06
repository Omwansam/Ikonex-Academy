import { useEffect, useState } from 'react';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import TabNav, { REPORTS_TABS } from '../../../components/layout/TabNav';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card, { CardHeader } from '../../../components/ui/Card';
import ReportCardPrint from '../../../components/cards/ReportCardPrint';
import { SubjectPerformanceChart, GradeDistributionChart } from '../../../components/charts/Charts';
import DataTable from '../../../components/ui/DataTable';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { reportService } from '../../../services/reportService';
import { studentService } from '../../../services/studentService';
import { classStreamService } from '../../../services/classStreamService';

export function ReportCardsPage() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { studentService.getAll({ pageSize: 100 }).then((r) => setStudents(r.data)); }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      reportService.getReportCard(selectedId).then(setReport).finally(() => setLoading(false));
    }
  }, [selectedId]);

  return (
    <div>
      <PageHeader title="Report Cards" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Reports' }, { label: 'Report Cards' }]} />
      <TabNav tabs={REPORTS_TABS} />
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Select label="Select Student" options={students.map((s) => ({ value: s.id, label: `${s.admissionNumber} - ${s.firstName} ${s.lastName}` }))} value={selectedId} onChange={(e) => setSelectedId(e.target.value)} containerClassName="max-w-md flex-1" />
        {report && (
          <Button variant="outline" onClick={() => window.print()}><FiPrinter /> Print</Button>
        )}
      </div>
      {loading ? <PageLoader /> : report ? <ReportCardPrint report={report} /> : (
        <Card><p className="text-center text-text-secondary py-8">Select a student to view their report card</p></Card>
      )}
    </div>
  );
}

export function GenerateReportsPage() {
  const [subjectPerf, setSubjectPerf] = useState([]);
  const [gradeDist, setGradeDist] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [bottomStudents, setBottomStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.getSubjectPerformance(),
      reportService.getGradeDistribution(),
      reportService.getTopStudents(),
      reportService.getBottomStudents(),
    ]).then(([sp, gd, top, bottom]) => {
      setSubjectPerf(sp);
      setGradeDist(gd);
      setTopStudents(top);
      setBottomStudents(bottom);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const rankingColumns = [
    { key: 'position', label: 'Rank' },
    { key: 'name', label: 'Name' },
    { key: 'stream', label: 'Stream' },
    { key: 'average', label: 'Average' },
  ];

  return (
    <div>
      <PageHeader title="Generate Reports" subtitle="Analytics and performance reports" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Reports' }, { label: 'Generate' }]} />
      <TabNav tabs={REPORTS_TABS} />
      <div className="grid gap-6 lg:grid-cols-2">
        <SubjectPerformanceChart data={subjectPerf} />
        <GradeDistributionChart data={gradeDist} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top Students" subtitle="Highest performing students" />
          <DataTable columns={rankingColumns} data={topStudents} />
        </Card>
        <Card>
          <CardHeader title="Students Needing Support" subtitle="Lowest performing students" />
          <DataTable columns={rankingColumns} data={bottomStudents} />
        </Card>
      </div>
    </div>
  );
}

export function ClassReportsPage() {
  const [streams, setStreams] = useState([]);
  const [streamId, setStreamId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);
  useEffect(() => {
    if (streamId) {
      setLoading(true);
      reportService.getClassResults(streamId).then(setResults).finally(() => setLoading(false));
    }
  }, [streamId]);

  const columns = [
    { key: 'admissionNumber', label: 'Adm No.' },
    { key: 'name', label: 'Student' },
    { key: 'total', label: 'Total' },
    { key: 'average', label: 'Average %' },
  ];

  return (
    <div>
      <PageHeader title="Class Reports" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Reports' }, { label: 'Class Reports' }]} />
      <TabNav tabs={REPORTS_TABS} />
      <Select label="Select Class Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} containerClassName="mb-6 max-w-md" />
      <DataTable columns={columns} data={results} loading={loading} emptyTitle="Select a class stream" />
    </div>
  );
}
