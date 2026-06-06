import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { subjectService } from '../../../services/subjectService';
import { classStreamService } from '../../../services/classStreamService';

export default function SubjectFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    Promise.all([subjectService.getTeachers(), classStreamService.getAllSimple()]).then(([t, s]) => {
      setTeachers(t);
      setStreams(s);
    });
    if (mode === 'edit' && id) {
      subjectService.getById(id).then((sub) => {
        reset(sub);
        setSelectedStreams(sub.streamIds || []);
        setLoading(false);
      });
    }
  }, [id, mode, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const teacher = teachers.find((t) => t.id === Number(data.teacherId));
    const payload = { ...data, teacherId: Number(data.teacherId), teacher: teacher?.name || '', streamIds: selectedStreams };
    try {
      if (mode === 'edit') await subjectService.update(id, payload);
      else await subjectService.create(payload);
      navigate('/admin/subjects');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title={mode === 'edit' ? 'Edit Subject' : 'Add Subject'} breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Subjects', path: '/admin/subjects' }, { label: mode === 'edit' ? 'Edit' : 'Add' }]} />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Subject Code" placeholder="e.g. MATH" error={errors.code?.message} {...register('code', { required: 'Required' })} />
            <Input label="Subject Name" placeholder="e.g. Mathematics" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          </div>
          <Input label="Description" {...register('description')} />
          <Select label="Teacher" options={teachers.map((t) => ({ value: t.id, label: t.name }))} error={errors.teacherId?.message} {...register('teacherId', { required: 'Required' })} />
          <div>
            <label className="mb-2 block text-sm font-medium">Assign to Streams</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {streams.map((s) => (
                <label key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm">
                  <input type="checkbox" checked={selectedStreams.includes(s.id)} onChange={(e) => {
                    setSelectedStreams(e.target.checked ? [...selectedStreams, s.id] : selectedStreams.filter((id) => id !== s.id));
                  }} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Add'} Subject</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/subjects')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function SubjectViewPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { subjectService.getById(id).then(setSubject).finally(() => setLoading(false)); }, [id]);
  if (loading) return <PageLoader />;
  if (!subject) return null;

  return (
    <div>
      <PageHeader title={subject.name} subtitle={`Code: ${subject.code}`} breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Subjects', path: '/admin/subjects' }, { label: subject.name }]} actionLabel="Edit Subject" onAction={() => navigate(`/admin/subjects/${id}/edit`)} />
      <Card className="max-w-2xl">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm text-text-secondary">Code</dt><dd className="font-medium">{subject.code}</dd></div>
          <div><dt className="text-sm text-text-secondary">Teacher</dt><dd className="font-medium">{subject.teacher}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-text-secondary">Description</dt><dd className="font-medium">{subject.description}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-text-secondary">Assigned Streams</dt><dd className="font-medium">{subject.streamIds?.length || 0} streams</dd></div>
        </dl>
      </Card>
    </div>
  );
}
