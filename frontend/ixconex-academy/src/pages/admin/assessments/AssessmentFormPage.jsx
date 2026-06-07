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
import { assessmentService } from '../../../services/assessmentService';
import { subjectService } from '../../../services/subjectService';
import { classStreamService } from '../../../services/classStreamService';
import { studentService } from '../../../services/studentService';
import { ASSESSMENT_TYPES } from '../../../utils/constants';

export default function AssessmentFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
      addToast(mode === 'edit' ? 'Assessment updated successfully' : 'Assessment created successfully');
      navigate('/admin/assessments');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={mode === 'edit' ? 'Edit Assessment' : 'Create Assessment'}
        subtitle={mode === 'edit' ? 'Update assessment details and scoring configuration' : 'Set up a new assessment for a class stream and subject'}
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Assessments', path: '/admin/assessments' },
          { label: mode === 'edit' ? 'Edit' : 'Create' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Assessment Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              placeholder="e.g. Term 1 CAT 1"
              containerClassName="sm:col-span-2"
              error={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />
            <Select
              label="Assessment Type"
              options={ASSESSMENT_TYPES.map((t) => ({ value: t, label: t }))}
              error={errors.type?.message}
              {...register('type', { required: 'Assessment type is required' })}
            />
            <Input
              label="Term"
              placeholder="e.g. Term 1"
              {...register('term')}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Class & Subject</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Subject"
              options={subjects.map((s) => ({ value: s.id, label: s.name }))}
              error={errors.subjectId?.message}
              {...register('subjectId', { required: 'Subject is required' })}
            />
            <Select
              label="Class Stream"
              options={streams.map((s) => ({ value: s.id, label: s.name }))}
              error={errors.streamId?.message}
              {...register('streamId', { required: 'Class stream is required' })}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Scoring & Schedule</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Maximum Score"
              type="number"
              placeholder="e.g. 100"
              error={errors.maxScore?.message}
              {...register('maxScore', { required: 'Maximum score is required', min: { value: 1, message: 'Must be at least 1' } })}
            />
            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date', { required: 'Date is required' })}
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary">Maximum score sets the upper limit when entering student results for this assessment.</p>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{mode === 'edit' ? 'Update' : 'Create'} Assessment</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/assessments')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export function EnterScoresPage() {
  const { addToast } = useToast();
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [existingScores, setExistingScores] = useState([]);
  const [selected, setSelected] = useState({ streamId: '', subjectId: '', assessmentId: '' });
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');
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
    setSubmitting(true);
    try {
      let submitted = 0;
      for (const [studentId, score] of Object.entries(scores)) {
        if (score === '' || score == null) continue;
        if (Number(score) > maxScore) throw new Error(`Score cannot exceed ${maxScore}`);
        const exists = existingScores.find((s) => s.studentId === Number(studentId));
        if (exists) throw new Error('Score already submitted for one or more students. Edit existing scores instead.');
        await assessmentService.submitScore({ assessmentId: selected.assessmentId, studentId, score });
        submitted++;
      }
      if (submitted === 0) throw new Error('Enter at least one score before submitting');
      addToast(`${submitted} score${submitted > 1 ? 's' : ''} submitted successfully`);
      setScores({});
      assessmentService.getScores(selected.assessmentId).then(setExistingScores);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssessments = assessments.filter(
    (a) => !selected.subjectId || a.subjectId === Number(selected.subjectId)
  );
  const scoredCount = existingScores.length;
  const pendingCount = students.length - scoredCount;

  return (
    <div>
      <PageHeader
        title="Enter Scores"
        subtitle="Select an assessment and enter scores for each student"
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Assessments', path: '/admin/assessments' },
          { label: 'Enter Scores' },
        ]}
      />

      <Card className="mb-6">
        <h3 className="mb-4 text-lg font-semibold">Select Assessment</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Class Stream"
            options={streams.map((s) => ({ value: s.id, label: s.name }))}
            value={selected.streamId}
            onChange={(e) => setSelected({ streamId: e.target.value, subjectId: '', assessmentId: '' })}
          />
          <Select
            label="Subject"
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            value={selected.subjectId}
            onChange={(e) => setSelected({ ...selected, subjectId: e.target.value, assessmentId: '' })}
            disabled={!selected.streamId}
          />
          <Select
            label="Assessment"
            options={filteredAssessments.map((a) => ({ value: a.id, label: a.title }))}
            value={selected.assessmentId}
            onChange={(e) => setSelected({ ...selected, assessmentId: e.target.value })}
            disabled={!selected.streamId}
          />
        </div>
      </Card>

      {selected.assessmentId && (
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">{error}</div>}

          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-text-secondary">Maximum Score</p>
              <p className="mt-1 text-2xl font-bold">{maxScore}</p>
            </Card>
            <Card>
              <p className="text-sm text-text-secondary">Scored</p>
              <p className="mt-1 text-2xl font-bold text-success">{scoredCount}</p>
            </Card>
            <Card>
              <p className="text-sm text-text-secondary">Pending</p>
              <p className="mt-1 text-2xl font-bold text-warning">{pendingCount}</p>
            </Card>
          </div>

          <Card>
            <h3 className="mb-4 text-lg font-semibold">Student Scores</h3>
            {students.length === 0 ? (
              <p className="text-sm text-text-secondary">No students found in this stream.</p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => {
                  const existing = existingScores.find((s) => s.studentId === student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-text-secondary">{student.admissionNumber}</p>
                      </div>
                      {existing ? (
                        <span className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-success">
                          {existing.score} / {maxScore}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max={maxScore}
                          placeholder={`0–${maxScore}`}
                          containerClassName="w-28"
                          value={scores[student.id] || ''}
                          onChange={(e) => setScores({ ...scores, [student.id]: e.target.value })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <Button type="submit" className="mt-6" loading={submitting} disabled={students.length === 0}>
              Submit Scores
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
