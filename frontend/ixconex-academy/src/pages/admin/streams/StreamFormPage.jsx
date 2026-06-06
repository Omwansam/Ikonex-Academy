import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { classStreamService } from '../../../services/classStreamService';
import { subjectService } from '../../../services/subjectService';
import { CLASS_LEVELS } from '../../../utils/constants';

export default function StreamFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    subjectService.getTeachers().then((t) => setTeachers(t));
    if (mode === 'edit' && id) {
      classStreamService.getById(id).then((stream) => {
        reset(stream);
        setValue('classTeacherId', stream.classTeacherId);
        setLoading(false);
      });
    }
  }, [id, mode, reset, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const teacher = teachers.find((t) => t.id === Number(data.classTeacherId));
    const payload = { ...data, classTeacherId: Number(data.classTeacherId), classTeacher: teacher?.name || '', capacity: Number(data.capacity) };
    try {
      if (mode === 'edit') await classStreamService.update(id, payload);
      else await classStreamService.create(payload);
      navigate('/admin/streams');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={mode === 'edit' ? 'Edit Class Stream' : 'Create Class Stream'}
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Streams', path: '/admin/streams' },
          { label: mode === 'edit' ? 'Edit' : 'Create' },
        ]}
      />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Stream Name" placeholder="e.g. Form 1A" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <Select label="Class Level" options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))} error={errors.classLevel?.message} {...register('classLevel', { required: 'Required' })} />
          <Input label="Capacity" type="number" error={errors.capacity?.message} {...register('capacity', { required: 'Required', min: 1 })} />
          <Select label="Class Teacher" options={teachers.map((t) => ({ value: t.id, label: t.name }))} error={errors.classTeacherId?.message} {...register('classTeacherId', { required: 'Required' })} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Create'} Stream</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/streams')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function StreamViewPage() {
  const { id } = useParams();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    classStreamService.getById(id).then(setStream).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!stream) return null;

  return (
    <div>
      <PageHeader
        title={stream.name}
        subtitle={`${stream.classLevel} · Class Teacher: ${stream.classTeacher}`}
        breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Streams', path: '/admin/streams' }, { label: stream.name }]}
        actionLabel="Edit Stream"
        onAction={() => navigate(`/admin/streams/${id}/edit`)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-text-secondary">Students Enrolled</p><p className="mt-1 text-3xl font-bold">{stream.studentCount}</p></Card>
        <Card><p className="text-sm text-text-secondary">Capacity</p><p className="mt-1 text-3xl font-bold">{stream.capacity}</p></Card>
        <Card><p className="text-sm text-text-secondary">Utilization</p><p className="mt-1 text-3xl font-bold">{Math.round((stream.studentCount / stream.capacity) * 100)}%</p></Card>
      </div>
    </div>
  );
}
