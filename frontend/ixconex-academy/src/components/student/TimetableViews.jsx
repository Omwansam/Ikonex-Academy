import { FiMapPin, FiUser } from 'react-icons/fi';

const SUBJECT_COLORS = {
  Mathematics: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
  English: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', dot: 'bg-violet-500' },
  Kiswahili: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', dot: 'bg-teal-500' },
  Biology: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', dot: 'bg-green-500' },
  Geography: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' },
  History: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
  Games: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', dot: 'bg-slate-400' };

export function getSubjectStyle(subject) {
  return SUBJECT_COLORS[subject] || DEFAULT_COLOR;
}

export function TimetableSlotCard({ slot, compact = false, active = false }) {
  const style = getSubjectStyle(slot.subject);

  if (compact) {
    return (
      <div className={`rounded-lg border p-2.5 transition-all ${style.bg} ${style.border} ${active ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
          <p className={`truncate text-xs font-semibold ${style.text}`}>{slot.subject}</p>
        </div>
        <p className="mt-1 truncate text-[10px] text-text-secondary">{slot.room}</p>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md ${style.bg} ${style.border} ${active ? 'ring-2 ring-primary shadow-md' : ''}`}>
      <div className={`absolute left-0 top-0 h-full w-1 ${style.dot}`} />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <p className={`font-semibold ${style.text}`}>{slot.subject}</p>
          <div className="mt-2 space-y-1 text-xs text-text-secondary">
            <p className="flex items-center gap-1.5"><FiUser size={12} />{slot.teacher}</p>
            <p className="flex items-center gap-1.5"><FiMapPin size={12} />{slot.room}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-white/80 px-2.5 py-1 text-xs font-bold text-text-primary shadow-sm">
          {slot.time}
        </span>
      </div>
    </div>
  );
}

export function WeeklyTimetableGrid({ schedule, activeDay }) {
  const days = schedule.map((d) => d.day);
  const timeSlots = [...new Set(schedule.flatMap((d) => d.slots.map((s) => s.time)))].sort();

  const getSlot = (day, time) => {
    const dayData = schedule.find((d) => d.day === day);
    return dayData?.slots.find((s) => s.time === time) || null;
  };

  return (
    <div className="table-scroll overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] border-collapse lg:min-w-[720px]">
        <thead>
          <tr>
            <th className="w-24 border-b border-r border-slate-100 bg-slate-50 px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className={`border-b border-slate-100 px-3 py-4 text-center text-sm font-semibold ${
                  day === activeDay ? 'bg-primary/5 text-primary' : 'bg-slate-50 text-text-primary'
                }`}
              >
                <span>{day.slice(0, 3)}</span>
                {day === activeDay && (
                  <span className="mt-1 block text-[10px] font-medium text-primary">Today</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time} className="border-b border-slate-50 last:border-0">
              <td className="border-r border-slate-100 bg-slate-50/50 px-3 py-4 align-top">
                <span className="text-sm font-bold text-primary">{time}</span>
              </td>
              {days.map((day) => {
                const slot = getSlot(day, time);
                const isToday = day === activeDay;
                return (
                  <td
                    key={`${day}-${time}`}
                    className={`px-2 py-3 align-top ${isToday ? 'bg-primary/[0.03]' : ''}`}
                  >
                    {slot ? (
                      <TimetableSlotCard slot={slot} compact />
                    ) : (
                      <div className="flex h-[52px] items-center justify-center rounded-lg border border-dashed border-slate-100">
                        <span className="text-xs text-slate-300">—</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DayScheduleList({ schedule, activeDay }) {
  return (
    <div className="space-y-4">
      {schedule.map((day) => (
        <div key={day.day} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className={`border-b px-4 py-3 sm:px-5 sm:py-4 ${day.day === activeDay ? 'bg-primary/5' : 'bg-slate-50'}`}>
            <h3 className={`font-semibold ${day.day === activeDay ? 'text-primary' : 'text-text-primary'}`}>
              {day.day}
              {day.day === activeDay && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">TODAY</span>
              )}
            </h3>
            <p className="text-xs text-text-secondary">{day.slots.length} periods</p>
          </div>
          <div className="space-y-3 p-3 sm:p-4">
            {day.slots.length === 0 ? (
              <p className="py-2 text-center text-sm text-text-secondary">No classes</p>
            ) : (
              day.slots.map((slot, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 py-2 sm:w-14">
                    <span className="text-xs font-bold text-primary">{slot.time.split(':')[0]}</span>
                    <span className="text-[10px] text-text-secondary">:{slot.time.split(':')[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary">{slot.subject}</p>
                    <p className="truncate text-xs text-text-secondary">{slot.teacher}</p>
                    <p className="truncate text-xs text-text-secondary">{slot.room}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodayTimeline({ slots, dayName }) {
  if (!slots.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <p className="text-lg font-medium text-text-primary">No classes today</p>
        <p className="mt-1 text-sm text-text-secondary">Enjoy your day off, {dayName}!</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      <div className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-gradient-to-b from-primary via-accent to-slate-200" />
      <div className="space-y-4">
        {slots.map((slot, idx) => {
          const style = getSubjectStyle(slot.subject);
          const isLast = idx === slots.length - 1;
          return (
            <div key={idx} className="relative">
              <div className={`absolute -left-8 top-5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white shadow-sm ${style.dot}`}>
                <span className="h-2 w-2 rounded-full bg-white" />
              </div>
              <TimetableSlotCard slot={slot} active={idx === 0} />
              {!isLast && <div className="h-4" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
