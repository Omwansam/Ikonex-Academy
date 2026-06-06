import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import SearchBar, { FilterBar } from '../../../components/ui/SearchBar';
import Select from '../../../components/ui/Select';
import Pagination from '../../../components/ui/Pagination';
import { StreamCard } from '../../../components/cards/EntityCards';
import { ConfirmDialog } from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../hooks/useDebounce';
import { classStreamService } from '../../../services/classStreamService';
import { CLASS_LEVELS } from '../../../utils/constants';

export default function StreamsListPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 9, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const result = await classStreamService.getAll({ search: debouncedSearch, classLevel, page, pageSize: 9 });
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, [debouncedSearch, classLevel]);

  const handleDelete = async () => {
    await classStreamService.delete(deleteId);
    setDeleteId(null);
    loadData(data.page);
  };

  return (
    <div>
      <PageHeader
        title="Class Streams"
        subtitle="Manage class streams and assignments"
        breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Class Streams' }]}
        actionLabel="Create Stream"
        onAction={() => navigate('/admin/streams/create')}
      />

      <FilterBar className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search streams..." className="flex-1" />
        <Select
          options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          placeholder="All Levels"
          containerClassName="w-full sm:w-48"
        />
        <div className="flex gap-2">
          <Button variant={viewMode === 'grid' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>Grid</Button>
          <Button variant={viewMode === 'table' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('table')}>Table</Button>
        </div>
      </FilterBar>

      {loading ? <PageLoader /> : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              {['Name', 'Level', 'Students', 'Capacity', 'Teacher', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-text-secondary">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {data.data.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.classLevel}</td>
                  <td className="px-4 py-3">{s.studentCount}</td>
                  <td className="px-4 py-3">{s.capacity}</td>
                  <td className="px-4 py-3">{s.classTeacher}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/streams/${s.id}`} className="text-primary"><FiEye /></Link>
                      <Link to={`/admin/streams/${s.id}/edit`} className="text-text-secondary"><FiEdit2 /></Link>
                      <button onClick={() => setDeleteId(s.id)} className="text-danger"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={loadData} />
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="Are you sure you want to delete this class stream?" />
    </div>
  );
}
