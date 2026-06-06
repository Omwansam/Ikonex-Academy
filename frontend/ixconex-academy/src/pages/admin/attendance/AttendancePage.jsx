import { useEffect, useState } from 'react';
import PageHeader from '../../../components/layout/PageHeader';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card, { CardHeader } from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';
import { PageLoader } from '../../../components/ui/LoadingSpinner';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';
import { attendanceService } from '../../../services/attendanceService';
import { classStreamService } from '../../../services/classStreamService';
import { formatDate } from '../../../utils/formatters';

const STATUS_OPTIONS = ['Present', 'Absent', 'Late'];

export default function AttendancePage() {
  const [streams, setStreams] = useState([]);
  const [streamId, setStreamId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => { classStreamService.getAllSimple().then(setStreams); }, []);

  useEffect(() => {
    if (!streamId) return;
    setLoading(true);
    Promise.all([
      attendanceService.getByStreamAndDate(streamId, date),
      attendanceService.getStreamStats(streamId),
    ]).then(([recs, st]) => {
      setRecords(recs);
      setStats(st);
    }).finally(() => setLoading(false));
  }, [streamId, date]);

  const updateStatus = (studentId, status) => {
    setRecords((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await attendanceService.saveAttendance({
        streamId,
        date,
        records: records.map(({ studentId, status }) => ({ studentId, status })),
      });
      addToast('Attendance saved successfully');
      const st = await attendanceService.getStreamStats(streamId);
      setStats(st);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Mark and track daily student attendance" breadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Attendance' }]} />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Class Stream" options={streams.map((s) => ({ value: s.id, label: s.name }))} value={streamId} onChange={(e) => setStreamId(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSave} loading={saving} disabled={!streamId} className="w-full">Save Attendance</Button>
          </div>
        </div>
      </Card>

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard title="Present Today" value={stats.todayPresent} icon={FiCheckCircle} color="success" />
          <StatCard title="Absent Today" value={stats.todayAbsent} icon={FiXCircle} color="danger" />
          <StatCard title="Late Today" value={stats.todayLate} icon={FiClock} color="warning" />
        </div>
      )}

      {loading ? <PageLoader /> : streamId ? (
        <Card padding={false}>
          <CardHeader title={`Roll Call — ${formatDate(date)}`} className="px-6 pt-6" />
          <div className="divide-y divide-slate-50">
            {records.map((record) => (
              <div key={record.studentId} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-text-primary">{record.name}</p>
                  <p className="text-sm text-text-secondary">{record.admissionNumber}</p>
                </div>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(record.studentId, status)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                        record.status === status
                          ? status === 'Present' ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                          : status === 'Absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-300'
                          : 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300'
                          : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card><p className="py-8 text-center text-text-secondary">Select a class stream to mark attendance</p></Card>
      )}
    </div>
  );
}
