import { useMemo, useState } from 'react';
import {
  FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiMapPin,
} from 'react-icons/fi';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const EVENT_META = {
  meeting: { label: 'Meeting', color: 'bg-blue-500', light: 'bg-blue-50 border-blue-200 text-blue-800', icon: '👥' },
  exam: { label: 'Exam', color: 'bg-red-500', light: 'bg-red-50 border-red-200 text-red-800', icon: '📝' },
  sports: { label: 'Sports', color: 'bg-green-500', light: 'bg-green-50 border-green-200 text-green-800', icon: '⚽' },
  event: { label: 'Event', color: 'bg-teal-500', light: 'bg-teal-50 border-teal-200 text-teal-800', icon: '🎉' },
  holiday: { label: 'Holiday', color: 'bg-amber-500', light: 'bg-amber-50 border-amber-200 text-amber-800', icon: '🏖️' },
};

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function MonthCalendar({ events, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate || new Date()));

  const eventMap = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const key = e.date;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1);
      days.push({ date: d, outside: true });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), outside: false });
    }
    while (days.length % 7 !== 0) {
      const next = days.length - startPad - lastDay.getDate() + 1;
      days.push({ date: new Date(year, month + 1, next), outside: true });
    }
    return days;
  }, [viewDate]);

  const todayKey = toDateKey(new Date());
  const selectedKey = selectedDate ? toDateKey(new Date(selectedDate)) : todayKey;

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-bold text-text-primary sm:text-lg">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <div className="flex gap-1 self-end sm:self-auto">
          <button type="button" onClick={prevMonth} className="rounded-lg p-2 text-text-secondary hover:bg-slate-100 hover:text-primary">
            <FiChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => { const t = new Date(); setViewDate(t); onSelectDate(t); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-blue-50">
            Today
          </button>
          <button type="button" onClick={nextMonth} className="rounded-lg p-2 text-text-secondary hover:bg-slate-100 hover:text-primary">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5 sm:mb-2 sm:gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-text-secondary sm:py-2 sm:text-xs">
            <span className="sm:hidden">{d.charAt(0)}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map(({ date, outside }, idx) => {
          const key = toDateKey(date);
          const dayEvents = eventMap[key] || [];
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`relative flex min-h-[40px] flex-col items-center rounded-lg p-0.5 text-xs transition-all sm:min-h-[52px] sm:rounded-xl sm:p-1.5 sm:text-sm ${
                outside ? 'text-slate-300' : 'text-text-primary hover:bg-slate-50'
              } ${isSelected ? 'bg-primary text-white shadow-md hover:bg-primary' : ''} ${isToday && !isSelected ? 'ring-2 ring-primary/30 ring-offset-1' : ''}`}
            >
              <span className={`font-medium ${isSelected ? 'text-white' : ''}`}>{date.getDate()}</span>
              {dayEvents.length > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/90' : EVENT_META[e.type]?.color || 'bg-primary'}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EventCard({ event, featured = false }) {
  const meta = EVENT_META[event.type] || EVENT_META.event;
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = MONTHS[eventDate.getMonth()].slice(0, 3);

  if (featured) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 ${meta.light}`}>
        <div className="absolute -right-4 -top-4 text-5xl opacity-20 sm:text-6xl">{meta.icon}</div>
        <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold capitalize shadow-sm">
          Next up · {meta.label}
        </span>
        <h3 className="mt-3 text-xl font-bold sm:mt-4 sm:text-2xl">{event.title}</h3>
        <div className="mt-3 flex flex-col gap-2 text-sm sm:mt-4 sm:flex-row sm:flex-wrap sm:gap-4">
          <span className="flex items-center gap-2 font-medium">
            <FiCalendar size={16} />
            {eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span className="flex items-center gap-2"><FiClock size={16} />{event.time}</span>
          <span className="flex items-center gap-2"><FiMapPin size={16} />{event.location}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md sm:gap-4 sm:p-4 ${event.isPast ? 'opacity-60' : ''}`}>
      <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border sm:h-16 sm:w-16 ${meta.light}`}>
        <span className="text-xs font-semibold uppercase">{month}</span>
        <span className="text-2xl font-bold leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.light}`}>
            {meta.label}
          </span>
        </div>
        <h4 className="mt-1 font-semibold text-text-primary">{event.title}</h4>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1"><FiClock size={12} />{event.time}</span>
          <span className="flex items-center gap-1"><FiMapPin size={12} />{event.location}</span>
        </div>
      </div>
    </div>
  );
}

export function EventTypeFilter({ types, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
          active === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-secondary ring-1 ring-slate-200 hover:ring-primary/30'
        }`}
      >
        All Events
      </button>
      {types.map((type) => {
        const meta = EVENT_META[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all ${
              active === type ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-secondary ring-1 ring-slate-200 hover:ring-primary/30'
            }`}
          >
            {meta?.icon} {meta?.label || type}
          </button>
        );
      })}
    </div>
  );
}
