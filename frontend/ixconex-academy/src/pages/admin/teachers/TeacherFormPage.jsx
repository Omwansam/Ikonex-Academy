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
      addToast(mode === 'edit' ? 'Teacher updated successfully' : 'Teacher added successfully');
      navigate('/admin/teachers');
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
        title={mode === 'edit' ? 'Edit Teacher' : 'Add Teacher'}
        subtitle={mode === 'edit' ? 'Update teacher profile and contact details' : 'Register a new teacher with subject specialization'}
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Teachers', path: '/admin/teachers' },
          { label: mode === 'edit' ? 'Edit' : 'Add' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="e.g. Jane Wanjiku"
              error={errors.name?.message}
              {...register('name', { required: 'Full name is required' })}
            />
            {mode === 'edit' && (
              <Select
                label="Status"
                options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                {...register('status')}
              />
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Professional Details</h3>
          <Input
            label="Subject Specialization"
            placeholder="e.g. Mathematics, English"
            error={errors.subject?.message}
            {...register('subject', { required: 'Subject specialization is required' })}
          />
          <p className="mt-3 text-xs text-text-secondary">The primary subject this teacher is qualified to teach.</p>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              placeholder="teacher@school.ac.ke"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Phone"
              placeholder="e.g. 0712 345 678"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone number is required' })}
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Add'} Teacher</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/teachers')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
