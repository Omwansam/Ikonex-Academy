import { useEffect, useMemo, useState } from 'react';
import { FiBook, FiCalendar, FiClock } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { TodayTimeline, WeeklyTimetableGrid, DayScheduleList } from '../../components/student/TimetableViews';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useStudentId } from '../../hooks/useStudentId';
import { studentPortalService } from '../../services/studentPortalService';

export default function StudentTimetablePage() {
  const studentId = useStudentId();
  const isMobile = useIsMobile();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (!studentId) return;
    studentPortalService.getTimetable(studentId).then(setData).finally(() => setLoading(false));
  }, [studentId]);

  useEffect(() => {
    setView(isMobile ? 'list' : 'grid');
  }, [isMobile]);

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
  const activeDay = isWeekday ? currentDayName : todayName;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        subtitle="Your weekly class schedule"
        breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Timetable' }]}
      >
        <span className="w-full rounded-xl bg-primary/10 px-4 py-2 text-center text-sm font-semibold text-primary sm:w-auto">
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

        <div className="min-w-0 xl:col-span-3">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Weekly Overview</h2>
              <p className="text-sm text-text-secondary">Monday to Friday class grid</p>
            </div>
            <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'list', label: 'By Day' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-none sm:py-1.5 ${
                    view === v.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {view === 'grid' ? (
            <WeeklyTimetableGrid schedule={data.schedule} activeDay={activeDay} />
          ) : (
            <DayScheduleList schedule={data.schedule} activeDay={activeDay} />
          )}
        </div>
      </div>

      <Card className="border-dashed bg-slate-50/50">
        <div className="flex flex-col gap-2 text-sm text-text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs sm:text-sm">Period 1: 08:00 – 09:15 · Period 2: 09:30 – 10:45 · Period 3: 11:00 – 12:15</p>
          <p className="font-medium text-text-primary">Academic Year 2024 · Term 1</p>
        </div>
      </Card>
    </div>
  );
}
