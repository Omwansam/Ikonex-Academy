import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLock, FiBell, FiMoon } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useStudentId } from '../../hooks/useStudentId';
import { useAuth } from '../../context/AuthContext';
import { studentPortalService } from '../../services/studentPortalService';

export default function StudentSettingsPage() {
  const studentId = useStudentId();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await studentPortalService.changePassword(studentId, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      addToast('Password changed successfully');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Settings' }]} />

      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary"><FiLock /></div>
            <div>
              <h3 className="font-semibold">Change Password</h3>
              <p className="text-sm text-text-secondary">Signed in as {user?.admissionNumber}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input label="Current Password" type="password" error={errors.currentPassword?.message} {...register('currentPassword', { required: 'Required' })} />
            <Input label="New Password" type="password" error={errors.newPassword?.message} {...register('newPassword', { required: 'Required', minLength: 6 })} />
            <Input label="Confirm New Password" type="password" {...register('confirmPassword', { required: 'Required' })} />
            <Button type="submit" loading={submitting}>Update Password</Button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-accent"><FiBell /></div>
            <h3 className="font-semibold">Notification Preferences</h3>
          </div>
          <div className="space-y-3">
            {['Results published', 'Upcoming assessments', 'Fee reminders', 'School announcements'].map((pref) => (
              <label key={pref} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <span className="text-sm text-text-primary">{pref}</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-secondary"><FiMoon /></div>
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-text-secondary">Dark mode support coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
