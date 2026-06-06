import { useEffect, useMemo, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  MonthCalendar, EventCard, EventTypeFilter, EVENT_META,
} from '../../components/student/CalendarViews';
import { studentPortalService } from '../../services/studentPortalService';

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export default function StudentCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    studentPortalService.getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return events;
    return events.filter((e) => e.type === typeFilter);
  }, [events, typeFilter]);

  const upcoming = useMemo(
    () => filteredEvents.filter((e) => !e.isPast).sort((a, b) => new Date(a.date) - new Date(b.date)),
    [filteredEvents],
  );

  const past = useMemo(
    () => filteredEvents.filter((e) => e.isPast).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filteredEvents],
  );

  const selectedKey = toDateKey(selectedDate);
  const selectedDayEvents = useMemo(
    () => events.filter((e) => e.date === selectedKey),
    [events, selectedKey],
  );

  const eventTypes = useMemo(() => [...new Set(events.map((e) => e.type))], [events]);
  const nextEvent = upcoming[0];

  const stats = useMemo(() => ({
    upcoming: events.filter((e) => !e.isPast).length,
    exams: events.filter((e) => !e.isPast && e.type === 'exam').length,
    thisMonth: events.filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && !e.isPast;
    }).length,
  }), [events]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Calendar"
        subtitle="Events, exams, and important dates"
        breadcrumbs={[{ label: 'Student', path: '/student' }, { label: 'Calendar' }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming Events" value={stats.upcoming} icon={FiCalendar} color="primary" />
        <StatCard title="Exams Scheduled" value={stats.exams} icon={FiCalendar} color="danger" />
        <StatCard title="This Month" value={stats.thisMonth} icon={FiCalendar} color="accent" />
      </div>

      {nextEvent && (
        <EventCard event={nextEvent} featured />
      )}

      <EventTypeFilter types={eventTypes} active={typeFilter} onChange={setTypeFilter} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <MonthCalendar
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <Card className="mt-4">
            <CardHeader
              title={selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              subtitle={selectedDayEvents.length ? `${selectedDayEvents.length} event(s)` : 'No events on this day'}
            />
            {selectedDayEvents.length === 0 ? (
              <p className="py-4 text-center text-sm text-text-secondary">No events scheduled.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <Card padding={false}>
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-text-primary">Upcoming Events</h2>
              <p className="text-sm text-text-secondary">{upcoming.length} events in the calendar</p>
            </div>
            <div className="space-y-3 p-4">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={FiCalendar}
                  title="No upcoming events"
                  description="Check back later for school announcements."
                />
              ) : (
                upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </Card>

          {past.length > 0 && (
            <Card padding={false}>
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-text-secondary">Past Events</h2>
              </div>
              <div className="space-y-3 p-4">
                {past.slice(0, 5).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-secondary to-slate-800 text-white">
            <h3 className="font-semibold">Event Legend</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(EVENT_META).map(([key, meta]) => (
                <div key={key} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
                  <span>{meta.icon}</span>
                  <span className="capitalize">{meta.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
