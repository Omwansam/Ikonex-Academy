import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';

export default function StudentSubjectsPage() {
  const studentId = useStudentId();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getSubjects(studentId).then(setSubjects).finally(() => setLoading(false));
  }, [studentId]);

  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="My Subjects" subtitle={`${subjects.length} subjects enrolled`} breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Subjects' }]} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." className="mb-6 max-w-md" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((subject) => (
          <Link key={subject.id} to={`/student/subjects/${subject.id}`}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{subject.code}</span>
                {subject.grade !== '—' && <Badge>{subject.grade}</Badge>}
              </div>
              <h3 className="mt-3 font-semibold text-text-primary">{subject.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{subject.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 text-sm">
                <span className="text-text-secondary">{subject.teacher}</span>
                {subject.total != null ? (
                  <span className="font-bold text-text-primary">{subject.total}/{subject.maxTotal}</span>
                ) : (
                  <span className="text-text-secondary">No score yet</span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                View details <FiChevronRight size={14} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
