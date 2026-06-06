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
import { teacherService } from '../../../services/teacherService';
import { STATUS_OPTIONS } from '../../../utils/constants';

export default function TeacherFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (mode === 'edit' && id) {
      teacherService.getById(id).then((t) => { reset(t); setLoading(false); });
    }
  }, [id, mode, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (mode === 'edit') await teacherService.update(id, data);
      else await teacherService.create(data);
      addToast(mode === 'edit' ? 'Teacher updated' : 'Teacher added');
      navigate('/admin/teachers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title={mode === 'edit' ? 'Edit Teacher' : 'Add Teacher'} breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Teachers', path: '/admin/teachers' }, { label: mode === 'edit' ? 'Edit' : 'Add' }]} />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <Input label="Subject Specialization" error={errors.subject?.message} {...register('subject', { required: 'Required' })} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
          {mode === 'edit' && (
            <Select label="Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} {...register('status')} />
          )}
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Add'} Teacher</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/teachers')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
