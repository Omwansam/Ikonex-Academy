import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { assessmentService } from '../../../services/assessmentService';
import { subjectService } from '../../../services/subjectService';
import { classStreamService } from '../../../services/classStreamService';
import { studentService } from '../../../services/studentService';
import { ASSESSMENT_TYPES } from '../../../utils/constants';

export default function AssessmentFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    Promise.all([subjectService.getAll({ pageSize: 100 }), classStreamService.getAllSimple()]).then(([s, st]) => {
      setSubjects(s.data);
      setStreams(st);
    });
    if (mode === 'edit' && id) {
      assessmentService.getById(id).then((a) => { reset(a); setLoading(false); });
    }
  }, [id, mode, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const subject = subjects.find((s) => s.id === Number(data.subjectId));
    const stream = streams.find((s) => s.id === Number(data.streamId));
    const payload = {
      ...data,
      subjectId: Number(data.subjectId),
      subjectName: subject?.name || '',
      streamId: Number(data.streamId),
      streamName: stream?.name || '',
      maxScore: Number(data.maxScore),
    };
    try {
      if (mode === 'edit') await assessmentService.update(id, payload);
      else await assessmentService.create(payload);
      navigate('/admin/assessments');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title={mode === 'edit' ? 'Edit Assessment' : 'Create Assessment'} breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Assessments', path: '/admin/assessments' }, { label: mode === 'edit' ? 'Edit' : 'Create' }]} />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" placeholder="e.g. Term 1 CAT 1" error={errors.title?.message} {...register('title', { required: 'Required' })} />
          <Select label="Assessment Type" options={ASSESSMENT_TYPES.map((t) => ({ value: t, label: t }))} error={errors.type?.message} {...register('type', { required: 'Required' })} />
          <Select label="Subject" options={subjects.map((s) => ({ value: s.id, label: s.name }))} error={errors.subjectId?.message} {...register('subjectId', { required: 'Required' })} />
          <Select label="Class Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} error={errors.streamId?.message} {...register('streamId', { required: 'Required' })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Maximum Score" type="number" error={errors.maxScore?.message} {...register('maxScore', { required: 'Required', min: 1 })} />
            <Input label="Date" type="date" error={errors.date?.message} {...register('date', { required: 'Required' })} />
          </div>
          <Input label="Term" placeholder="e.g. Term 1" {...register('term')} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/assessments')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function EnterScoresPage() {
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [existingScores, setExistingScores] = useState([]);
  const [selected, setSelected] = useState({ streamId: '', subjectId: '', assessmentId: '' });
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [maxScore, setMaxScore] = useState(100);

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);

  useEffect(() => {
    if (selected.streamId) {
      subjectService.getAll({ pageSize: 100 }).then((r) => setSubjects(r.data));
      studentService.getAll({ streamId: selected.streamId, pageSize: 100 }).then((r) => setStudents(r.data));
    }
  }, [selected.streamId]);

  useEffect(() => {
    if (selected.streamId) {
      assessmentService.getAll({ streamId: selected.streamId, pageSize: 100 }).then((r) => setAssessments(r.data));
    }
  }, [selected.streamId, selected.subjectId]);

  useEffect(() => {
    if (selected.assessmentId) {
      const assessment = assessments.find((a) => a.id === Number(selected.assessmentId));
      setMaxScore(assessment?.maxScore || 100);
      assessmentService.getScores(selected.assessmentId).then(setExistingScores);
    }
  }, [selected.assessmentId, assessments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      for (const [studentId, score] of Object.entries(scores)) {
        if (score === '' || score == null) continue;
        if (Number(score) > maxScore) throw new Error(`Score cannot exceed ${maxScore}`);
        const exists = existingScores.find((s) => s.studentId === Number(studentId));
        if (exists) throw new Error('Score already submitted for one or more students. Edit existing scores instead.');
        await assessmentService.submitScore({ assessmentId: selected.assessmentId, studentId, score });
      }
      setSuccess('Scores submitted successfully');
      setScores({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Enter Scores" subtitle="Submit student assessment scores" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Assessments', path: '/admin/assessments' }, { label: 'Enter Scores' }]} />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Class Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} value={selected.streamId} onChange={(e) => setSelected({ streamId: e.target.value, subjectId: '', assessmentId: '' })} />
          <Select label="Subject" options={subjects.map((s) => ({ value: s.id, label: s.name }))} value={selected.subjectId} onChange={(e) => setSelected({ ...selected, subjectId: e.target.value, assessmentId: '' })} />
          <Select label="Assessment" options={assessments.filter((a) => !selected.subjectId || a.subjectId === Number(selected.subjectId)).map((a) => ({ value: a.id, label: a.title }))} value={selected.assessmentId} onChange={(e) => setSelected({ ...selected, assessmentId: e.target.value })} />
        </div>
      </Card>

      {selected.assessmentId && (
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-success">{success}</div>}
          <Card>
            <p className="mb-4 text-sm text-text-secondary">Maximum score: <strong>{maxScore}</strong></p>
            <div className="space-y-3">
              {students.map((student) => {
                const existing = existingScores.find((s) => s.studentId === student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-text-secondary">{student.admissionNumber}</p>
                    </div>
                    {existing ? (
                      <span className="rounded-lg bg-green-50 px-3 py-1 text-sm font-medium text-success">{existing.score} / {maxScore}</span>
                    ) : (
                      <input type="number" min="0" max={maxScore} placeholder="Score" className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm" value={scores[student.id] || ''} onChange={(e) => setScores({ ...scores, [student.id]: e.target.value })} />
                    )}
                  </div>
                );
              })}
            </div>
            <Button type="submit" className="mt-4" loading={submitting}>Submit Scores</Button>
          </Card>
        </form>
      )}
    </div>
  );
}
