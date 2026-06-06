import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import SearchBar from '../../../components/ui/SearchBar';
import Pagination from '../../../components/ui/Pagination';
import { SubjectCard } from '../../../components/cards/EntityCards';
import { ConfirmDialog } from '../../../components/ui/Modal';
import StatCard from '../../../components/ui/StatCard';
import { FiBook } from 'react-icons/fi';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../hooks/useDebounce';
import { subjectService } from '../../../services/subjectService';

export default function SubjectsListPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 9, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const [result, s] = await Promise.all([
        subjectService.getAll({ search: debouncedSearch, page, pageSize: 9 }),
        subjectService.getStats(),
      ]);
      setData(result);
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, [debouncedSearch]);

  return (
    <div>
      <PageHeader title="Subjects" subtitle="Manage curriculum subjects" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Subjects' }]} actionLabel="Add Subject" onAction={() => navigate('/admin/subjects/create')} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Subjects" value={stats.total} icon={FiBook} color="primary" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." className="mb-6 max-w-md" />

      {loading ? <PageLoader /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      <div className="mt-6"><Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={loadData} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await subjectService.delete(deleteId); setDeleteId(null); loadData(data.page); }} message="Delete this subject?" />
    </div>
  );
}
