import { useEffect, useState } from 'react';
import PageHeader from '../../../components/layout/PageHeader';
import TabNav, { RESULTS_TABS } from '../../../components/layout/TabNav';
import Select from '../../../components/ui/Select';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { reportService } from '../../../services/reportService';
import { studentService } from '../../../services/studentService';
import { classStreamService } from '../../../services/classStreamService';
import { subjectService } from '../../../services/subjectService';

export function StudentResultsPage() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { studentService.getAll({ pageSize: 100 }).then((r) => setStudents(r.data)); }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      reportService.getStudentResults(selectedId).then(setResults).finally(() => setLoading(false));
    }
  }, [selectedId]);

  const columns = [
    { key: 'subjectName', label: 'Subject' },
    { key: 'cat', label: 'CAT' },
    { key: 'exam', label: 'Exam' },
    { key: 'total', label: 'Total' },
    { key: 'grade', label: 'Grade', render: (r) => <Badge>{r.grade}</Badge> },
  ];

  const total = results.reduce((s, r) => s + r.total, 0);
  const average = results.length ? (total / results.length).toFixed(1) : 0;

  return (
    <div>
      <PageHeader title="Student Results" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Results' }, { label: 'Student Results' }]} />
      <TabNav tabs={RESULTS_TABS} />
      <Select label="Select Student" options={students.map((s) => ({ value: s.id, label: `${s.admissionNumber} - ${s.firstName} ${s.lastName}` }))} value={selectedId} onChange={(e) => setSelectedId(e.target.value)} containerClassName="mb-6 max-w-md" />
      {selectedId && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card><p className="text-sm text-text-secondary">Total Marks</p><p className="text-2xl font-bold">{total}</p></Card>
            <Card><p className="text-sm text-text-secondary">Average</p><p className="text-2xl font-bold">{average}</p></Card>
            <Card><p className="text-sm text-text-secondary">Subjects</p><p className="text-2xl font-bold">{results.length}</p></Card>
          </div>
          <DataTable columns={columns} data={results} loading={loading} />
        </>
      )}
    </div>
  );
}

export function ClassResultsPage() {
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
    { key: 'name', label: 'Name' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'total', label: 'Total Marks' },
    { key: 'average', label: 'Average' },
  ];

  return (
    <div>
      <PageHeader title="Class Results" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Results' }, { label: 'Class Results' }]} />
      <TabNav tabs={RESULTS_TABS} />
      <Select label="Select Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} containerClassName="mb-6 max-w-md" />
      <DataTable columns={columns} data={results} loading={loading} />
    </div>
  );
}

export function SubjectResultsPage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { subjectService.getAll({ pageSize: 100 }).then((r) => setSubjects(r.data)); }, []);
  useEffect(() => {
    if (subjectId) {
      setLoading(true);
      reportService.getSubjectResults(subjectId).then(setResults).finally(() => setLoading(false));
    }
  }, [subjectId]);

  const columns = [
    { key: 'subjectName', label: 'Subject' },
    { key: 'cat', label: 'CAT' },
    { key: 'exam', label: 'Exam' },
    { key: 'total', label: 'Total' },
    { key: 'grade', label: 'Grade', render: (r) => <Badge>{r.grade}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Subject Results" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Results' }, { label: 'Subject Results' }]} />
      <TabNav tabs={RESULTS_TABS} />
      <Select label="Select Subject" options={subjects.map((s) => ({ value: s.id, label: s.name }))} value={subjectId} onChange={(e) => setSubjectId(e.target.value)} containerClassName="mb-6 max-w-md" />
      <DataTable columns={columns} data={results} loading={loading} />
    </div>
  );
}

export function RankingsPage() {
  const [streams, setStreams] = useState([]);
  const [streamId, setStreamId] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);

  useEffect(() => {
    setLoading(true);
    reportService.getRankings({ streamId: streamId || undefined }).then(setRankings).finally(() => setLoading(false));
  }, [streamId]);

  const columns = [
    { key: 'position', label: 'Position', render: (r) => <span className="font-bold text-primary">#{r.position}</span> },
    { key: 'admissionNumber', label: 'Adm No.' },
    { key: 'name', label: 'Name' },
    { key: 'stream', label: 'Stream' },
    { key: 'totalMarks', label: 'Total Marks' },
    { key: 'average', label: 'Average' },
  ];

  return (
    <div>
      <PageHeader title="Rankings" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Results' }, { label: 'Rankings' }]} />
      <TabNav tabs={RESULTS_TABS} />
      <Select label="Filter by Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} placeholder="All Streams" containerClassName="mb-6 max-w-md" />
      <DataTable columns={columns} data={rankings} loading={loading} />
    </div>
  );
}