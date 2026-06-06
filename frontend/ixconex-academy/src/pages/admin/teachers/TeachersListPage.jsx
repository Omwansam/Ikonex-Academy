import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import SearchBar from '../../../components/ui/SearchBar';
import DataTable from '../../../components/ui/DataTable';
import Pagination from '../../../components/ui/Pagination';
import Badge from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../context/ToastContext';
import { teacherService } from '../../../services/teacherService';

export default function TeachersListPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      setData(await teacherService.getAll({ search: debouncedSearch, page }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, [debouncedSearch]);

  const handleDelete = async () => {
    await teacherService.delete(deleteId);
    setDeleteId(null);
    addToast('Teacher removed successfully');
    loadData(data.page);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'email', label: 'Email', render: (r) => <span className="flex items-center gap-1"><FiMail size={14} />{r.email}</span> },
    { key: 'phone', label: 'Phone', render: (r) => <span className="flex items-center gap-1"><FiPhone size={14} />{r.phone}</span> },
    { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link to={`/admin/teachers/${r.id}/edit`} className="text-text-secondary hover:text-primary"><FiEdit2 /></Link>
          <button onClick={() => setDeleteId(r.id)} className="text-danger hover:text-red-700"><FiTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Teachers" subtitle="Manage teaching staff" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Teachers' }]} actionLabel="Add Teacher" onAction={() => navigate('/admin/teachers/create')} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search teachers..." className="mb-6 max-w-md" />
      <DataTable columns={columns} data={data.data} loading={loading} emptyTitle="No teachers found" />
      <div className="mt-6"><Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={loadData} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="Remove this teacher from the system?" />
    </div>
  );
}
