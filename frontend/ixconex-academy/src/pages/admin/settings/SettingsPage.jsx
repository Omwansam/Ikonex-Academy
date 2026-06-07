import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';
import { settingsService } from '../../../services/notificationService';

const TERMS = ['Term 1', 'Term 2', 'Term 3'];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    settingsService.get().then((s) => { reset(s); setLoading(false); });
  }, [reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await settingsService.update(data);
      addToast('Settings saved successfully');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Settings" subtitle="School configuration and preferences" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Settings' }]} />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="School Name" {...register('schoolName')} />
          <Input label="Motto" {...register('motto')} />
          <Input label="Address" {...register('address')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone" {...register('phone')} />
            <Input label="Email" type="email" {...register('email')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Academic Year" {...register('academicYear')} />
            <Select label="Current Term" options={TERMS.map((t) => ({ value: t, label: t }))} {...register('currentTerm')} />
          </div>
          <Input label="Grading System" {...register('gradingSystem')} />
          <Button type="submit" loading={submitting}>Save Settings</Button>
        </form>
      </Card>
    </div>
  );
}
