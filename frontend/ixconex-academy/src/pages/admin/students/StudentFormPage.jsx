import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { studentService } from '../../../services/studentService';
import { classStreamService } from '../../../services/classStreamService';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '../../../utils/constants';
import { useToast } from '../../../context/ToastContext';
import { formatDate, formatFullName, toInputDate } from '../../../utils/formatters';

export default function StudentFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    classStreamService.getAllSimple().then(setStreams);
    if (mode === 'edit' && id) {
      studentService.getById(id).then((s) => {
        reset({
          ...s,
          dateOfBirth: toInputDate(s.dateOfBirth),
          admissionDate: toInputDate(s.admissionDate),
        });
        setLoading(false);
      });
    }
  }, [id, mode, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const stream = streams.find((s) => s.id === Number(data.streamId));
    const payload = { ...data, streamId: Number(data.streamId), streamName: stream?.name || '' };
    try {
      if (mode === 'edit') await studentService.update(id, payload);
      else await studentService.create(payload);
      addToast(mode === 'edit' ? 'Student updated successfully' : 'Student registered successfully');
      navigate('/admin/students');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={mode === 'edit' ? 'Edit Student' : 'Register Student'}
        breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Students', path: '/admin/students' }, { label: mode === 'edit' ? 'Edit' : 'Register' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" error={errors.firstName?.message} {...register('firstName', { required: 'Required' })} />
            <Input label="Last Name" error={errors.lastName?.message} {...register('lastName', { required: 'Required' })} />
            <Input label="Admission Number" error={errors.admissionNumber?.message} {...register('admissionNumber', { required: 'Required' })} />
            <Input label="Date of Birth" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth', { required: 'Required' })} />
            <Select label="Gender" options={GENDER_OPTIONS.map((g) => ({ value: g, label: g }))} error={errors.gender?.message} {...register('gender', { required: 'Required' })} />
            <Input label="Nationality" defaultValue="Kenyan" {...register('nationality')} />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Profile Image</label>
            <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-primary">
              <FiUpload className="h-6 w-6 text-text-secondary" />
              <p className="mt-2 text-sm text-text-secondary">Click to upload or drag and drop</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Academic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Class Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} error={errors.streamId?.message} {...register('streamId', { required: 'Required' })} />
            <Input label="Admission Date" type="date" error={errors.admissionDate?.message} {...register('admissionDate', { required: 'Required' })} />
            {mode === 'edit' && (
              <Select label="Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} {...register('status')} />
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Parent Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Parent Name" error={errors.parentName?.message} {...register('parentName', { required: 'Required' })} />
            <Input label="Parent Phone" error={errors.parentPhone?.message} {...register('parentPhone', { required: 'Required' })} />
            <Input label="Parent Email" type="email" containerClassName="sm:col-span-2" {...register('parentEmail')} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Register'} Student</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/students')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentService.getById(id).then(setStudent).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!student) return null;

  const fields = [
    ['Admission Number', student.admissionNumber],
    ['Full Name', formatFullName(student.firstName, student.lastName)],
    ['Gender', student.gender],
    ['Date of Birth', formatDate(student.dateOfBirth)],
    ['Nationality', student.nationality],
    ['Class Stream', student.streamName],
    ['Admission Date', formatDate(student.admissionDate)],
    ['Status', student.status],
    ['Parent Name', student.parentName],
    ['Parent Phone', student.parentPhone],
    ['Parent Email', student.parentEmail || '—'],
  ];

  return (
    <div>
      <PageHeader
        title={formatFullName(student.firstName, student.lastName)}
        subtitle={student.admissionNumber}
        breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Students', path: '/admin/students' }, { label: 'Details' }]}
        actionLabel="Edit Student"
        onAction={() => navigate(`/admin/students/${id}/edit`)}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center lg:col-span-1">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <h2 className="mt-4 text-xl font-bold">{formatFullName(student.firstName, student.lastName)}</h2>
          <p className="text-sm text-text-secondary">{student.admissionNumber}</p>
          <Badge className="mt-2">{student.status}</Badge>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Student Information</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-text-secondary">{label}</dt>
                <dd className="mt-0.5 font-medium text-text-primary">{label === 'Status' ? <Badge>{value}</Badge> : value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
