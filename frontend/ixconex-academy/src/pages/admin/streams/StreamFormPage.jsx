import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';
import { classStreamService } from '../../../services/classStreamService';
import { subjectService } from '../../../services/subjectService';
import { CLASS_LEVELS } from '../../../utils/constants';

export default function StreamFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
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
      addToast(mode === 'edit' ? 'Stream updated successfully' : 'Stream created successfully');
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
        subtitle={mode === 'edit' ? 'Update stream details and class teacher assignment' : 'Set up a new class stream with capacity and teacher'}
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Streams', path: '/admin/streams' },
          { label: mode === 'edit' ? 'Edit' : 'Create' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Stream Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Stream Name"
              placeholder="e.g. Form 1A"
              error={errors.name?.message}
              {...register('name', { required: 'Stream name is required' })}
            />
            <Select
              label="Class Level"
              options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
              error={errors.classLevel?.message}
              {...register('classLevel', { required: 'Class level is required' })}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Assignment & Capacity</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Capacity"
              type="number"
              placeholder="e.g. 40"
              error={errors.capacity?.message}
              {...register('capacity', { required: 'Capacity is required', min: { value: 1, message: 'Must be at least 1' } })}
            />
            <Select
              label="Class Teacher"
              options={teachers.map((t) => ({ value: t.id, label: `${t.name} — ${t.subject}` }))}
              error={errors.classTeacherId?.message}
              {...register('classTeacherId', { required: 'Class teacher is required' })}
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary">Capacity determines the maximum number of students that can be enrolled in this stream.</p>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Create'} Stream</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/streams')}>Cancel</Button>
        </div>
      </form>
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

  const utilization = Math.round((stream.studentCount / stream.capacity) * 100);

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
        <Card>
          <p className="text-sm text-text-secondary">Students Enrolled</p>
          <p className="mt-1 text-3xl font-bold">{stream.studentCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Capacity</p>
          <p className="mt-1 text-3xl font-bold">{stream.capacity}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Utilization</p>
          <p className="mt-1 text-3xl font-bold">{utilization}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${utilization >= 90 ? 'bg-danger' : utilization >= 70 ? 'bg-warning' : 'bg-primary'}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Stream Information</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-text-secondary">Stream Name</dt>
            <dd className="mt-0.5 font-medium">{stream.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Class Level</dt>
            <dd className="mt-0.5 font-medium">{stream.classLevel}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Class Teacher</dt>
            <dd className="mt-0.5 font-medium">{stream.classTeacher}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Available Slots</dt>
            <dd className="mt-0.5 font-medium">{Math.max(stream.capacity - stream.studentCount, 0)} remaining</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
