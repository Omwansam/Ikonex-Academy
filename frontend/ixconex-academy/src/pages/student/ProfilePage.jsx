import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiUser, FiEdit2 } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';
import { formatDate } from '../../utils/formatters';

export default function StudentProfilePage() {
  const studentId = useStudentId();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getProfile(studentId).then((p) => {
      setProfile(p);
      reset({ parentName: p.student.parentName, parentPhone: p.student.parentPhone, parentEmail: p.student.parentEmail });
    }).finally(() => setLoading(false));
  }, [studentId, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await studentPortalService.updateProfile(studentId, data);
      addToast('Contact information updated');
      setEditing(false);
      const updated = await studentPortalService.getProfile(studentId);
      setProfile(updated);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!profile) return null;

  const { student, stream, settings } = profile;

  const personalFields = [
    ['Date of Birth', formatDate(student.dateOfBirth)],
    ['Gender', student.gender],
    ['Nationality', student.nationality],
    ['Admission Date', formatDate(student.admissionDate)],
  ];

  const academicFields = [
    ['Class Stream', student.streamName],
    ['Class Level', stream?.classLevel],
    ['Class Teacher', stream?.classTeacher],
    ['Academic Year', settings.academicYear],
    ['Current Term', settings.currentTerm],
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Personal and academic information" breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Profile' }]}>
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}><FiEdit2 /> Edit Contacts</Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" className="flex flex-col items-center text-center lg:col-span-1">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-4xl font-bold text-primary shadow-inner">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <h2 className="mt-4 text-xl font-bold">{student.firstName} {student.lastName}</h2>
          <p className="text-sm text-text-secondary">{student.admissionNumber}</p>
          <Badge className="mt-2">{student.status}</Badge>
          <div className="mt-6 w-full space-y-3 text-left text-sm">
            <div className="flex items-center gap-2 text-text-secondary"><FiUser size={16} />{student.gender}</div>
            <div className="flex items-center gap-2 text-text-secondary"><FiPhone size={16} />{student.parentPhone}</div>
            <div className="flex items-center gap-2 text-text-secondary"><FiMail size={16} />{student.parentEmail || '—'}</div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-bold text-text-primary">Personal Information</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              {personalFields.map(([label, value]) => (
                <div key={label}><dt className="text-sm text-text-secondary">{label}</dt><dd className="font-medium">{value}</dd></div>
              ))}
            </dl>
          </Card>

          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-bold text-text-primary">Academic Information</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              {academicFields.map(([label, value]) => (
                <div key={label}><dt className="text-sm text-text-secondary">{label}</dt><dd className="font-medium">{value}</dd></div>
              ))}
            </dl>
          </Card>

          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-bold text-text-primary">Parent / Guardian Contact</h3>
            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Parent Name" {...register('parentName')} />
                <Input label="Parent Phone" {...register('parentPhone')} />
                <Input label="Parent Email" type="email" {...register('parentEmail')} />
                <div className="flex gap-3">
                  <Button type="submit" loading={submitting}>Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-2">
                <div><dt className="text-sm text-text-secondary">Name</dt><dd className="font-medium">{student.parentName}</dd></div>
                <div><dt className="text-sm text-text-secondary">Phone</dt><dd className="font-medium">{student.parentPhone}</dd></div>
                <div className="sm:col-span-2"><dt className="text-sm text-text-secondary">Email</dt><dd className="font-medium">{student.parentEmail || '—'}</dd></div>
              </dl>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
