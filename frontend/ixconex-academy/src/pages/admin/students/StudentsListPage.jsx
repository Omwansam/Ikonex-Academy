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
import Button from '../../../components/ui/Button';
import { useDebounce } from '../../../hooks/useDebounce';
import { studentService } from '../../../services/studentService';
import { classStreamService } from '../../../services/classStreamService';
import { formatFullName } from '../../../utils/formatters';
import { STATUS_OPTIONS } from '../../../utils/constants';

export default function StudentsListPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [streamId, setStreamId] = useState('');
  const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const result = await studentService.getAll({ search: debouncedSearch, streamId, status, page, pageSize: 10 });
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, [debouncedSearch, streamId, status]);

  const columns = [
    { key: 'admissionNumber', label: 'Admission No.' },
    { key: 'name', label: 'Full Name', render: (r) => formatFullName(r.firstName, r.lastName) },
    { key: 'gender', label: 'Gender' },
    { key: 'streamName', label: 'Class Stream' },
    { key: 'parentPhone', label: 'Parent Contact' },
    { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link to={`/admin/students/${r.id}`} className="text-primary hover:text-blue-700"><FiEye /></Link>
          <Link to={`/admin/students/${r.id}/edit`} className="text-text-secondary hover:text-text-primary"><FiEdit2 /></Link>
          <button onClick={() => setDeleteId(r.id)} className="text-danger hover:text-red-700"><FiTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage student records"
        breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Students' }]}
        actionLabel="Register Student"
        onAction={() => navigate('/admin/students/register')}
      />

      <FilterBar className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or admission number..." className="flex-1" />
        <Select options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} placeholder="All Streams" containerClassName="w-full sm:w-44" />
        <Select options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All Status" containerClassName="w-full sm:w-40" />
      </FilterBar>

      <DataTable columns={columns} data={data.data} loading={loading} emptyTitle="No students found" />
      <div className="mt-6">
        <Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={loadData} />
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await studentService.delete(deleteId); setDeleteId(null); loadData(data.page); }} message="Delete this student record?" />
    </div>
  );
}
