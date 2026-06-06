import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import SearchBar, { FilterBar } from '../../../components/ui/SearchBar';
import Select from '../../../components/ui/Select';
import DataTable from '../../../components/ui/DataTable';
import Pagination from '../../../components/ui/Pagination';
import Badge from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import { assessmentService } from '../../../services/assessmentService';
import { classStreamService } from '../../../services/classStreamService';
import { ASSESSMENT_TYPES } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatters';

export default function AssessmentsListPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [streamId, setStreamId] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      setData(await assessmentService.getAll({ search: debouncedSearch, type, streamId, page }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, [debouncedSearch, type, streamId]);

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant="primary">{r.type}</Badge> },
    { key: 'subjectName', label: 'Subject' },
    { key: 'streamName', label: 'Stream' },
    { key: 'maxScore', label: 'Max Score' },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link to={`/admin/assessments/${r.id}/edit`} className="text-text-secondary"><FiEdit2 /></Link>
          <button onClick={() => setDeleteId(r.id)} className="text-danger"><FiTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Assessments" subtitle="Manage assessments and exams" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Assessments' }]} actionLabel="Create Assessment" onAction={() => navigate('/admin/assessments/create')}>
        <Link to="/admin/assessments/scores" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-text-primary hover:bg-slate-50">Enter Scores</Link>
      </PageHeader>

      <FilterBar className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search assessments..." className="flex-1" />
        <Select options={ASSESSMENT_TYPES.map((t) => ({ value: t, label: t }))} value={type} onChange={(e) => setType(e.target.value)} placeholder="All Types" containerClassName="w-full sm:w-44" />
        <Select options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} placeholder="All Streams" containerClassName="w-full sm:w-44" />
      </FilterBar>

      <DataTable columns={columns} data={data.data} loading={loading} />
      <div className="mt-6"><Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={loadData} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await assessmentService.delete(deleteId); setDeleteId(null); loadData(data.page); }} message="Delete this assessment?" />
    </div>
  );
}
