import { useEffect, useMemo, useState } from 'react';
import { FiBook, FiCalendar, FiClock } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { TodayTimeline, WeeklyTimetableGrid } from '../../components/student/TimetableViews';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';

export default function StudentTimetablePage() {
  const studentId = useStudentId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getTimetable(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  const stats = useMemo(() => {
    if (!data) return null;
    const totalClasses = data.schedule.reduce((sum, d) => sum + d.slots.length, 0);
    const todayCount = data.today.slots.length;
    const uniqueSubjects = new Set(data.schedule.flatMap((d) => d.slots.map((s) => s.subject))).size;
    return { totalClasses, todayCount, uniqueSubjects };
  }, [data]);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const todayName = data.today.day;
  const now = new Date();
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  const isWeekday = data.schedule.some((d) => d.day === currentDayName);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        subtitle="Your weekly class schedule"
        breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Timetable' }]}
      >
        <span className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {data.streamName}
        </span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Classes Today" value={stats.todayCount} icon={FiClock} color="primary" />
        <StatCard title="Weekly Classes" value={stats.totalClasses} icon={FiCalendar} color="accent" />
        <StatCard title="Subjects" value={stats.uniqueSubjects} icon={FiBook} color="secondary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2" padding>
          <CardHeader
            title={isWeekday && todayName === currentDayName ? `Today · ${todayName}` : `Schedule · ${todayName}`}
            subtitle={stats.todayCount > 0 ? `${stats.todayCount} class${stats.todayCount > 1 ? 'es' : ''} scheduled` : 'No classes scheduled'}
          />
          <TodayTimeline slots={data.today.slots} dayName={todayName} />
        </Card>

        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Weekly Overview</h2>
              <p className="text-sm text-text-secondary">Monday to Friday class grid</p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'list', label: 'By Day' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    view === v.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {view === 'grid' ? (
            <WeeklyTimetableGrid schedule={data.schedule} activeDay={isWeekday ? currentDayName : todayName} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.schedule.map((day) => (
                <Card key={day.day} padding={false}>
                  <div className={`border-b px-5 py-4 ${day.day === currentDayName ? 'bg-primary/5' : 'bg-slate-50'}`}>
                    <h3 className={`font-semibold ${day.day === currentDayName ? 'text-primary' : 'text-text-primary'}`}>
                      {day.day}
                      {day.day === currentDayName && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">TODAY</span>
                      )}
                    </h3>
                    <p className="text-xs text-text-secondary">{day.slots.length} periods</p>
                  </div>
                  <div className="space-y-3 p-4">
                    {day.slots.map((slot, idx) => (
                      <div key={idx} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 py-2">
                          <span className="text-xs font-bold text-primary">{slot.time.split(':')[0]}</span>
                          <span className="text-[10px] text-text-secondary">:{slot.time.split(':')[1]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{slot.subject}</p>
                          <p className="text-xs text-text-secondary">{slot.teacher}</p>
                          <p className="text-xs text-text-secondary">{slot.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Card className="border-dashed bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
          <p>Period 1: 08:00 – 09:15 · Period 2: 09:30 – 10:45 · Period 3: 11:00 – 12:15</p>
          <p className="font-medium text-text-primary">Academic Year 2024 · Term 1</p>
        </div>
      </Card>
    </div>
  );
}
