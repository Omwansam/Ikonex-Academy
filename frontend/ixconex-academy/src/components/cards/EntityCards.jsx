import { Link } from 'react-router-dom';
import { FiEdit2, FiEye, FiUsers } from 'react-icons/fi';
import Badge from '../ui/Badge';
import { formatFullName } from '../../utils/formatters';

export default function StudentCard({ student, onView, onEdit }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-lg font-bold text-primary">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-text-primary">{formatFullName(student.firstName, student.lastName)}</h3>
                <p className="text-sm text-text-secondary">{student.admissionNumber}</p>
              </div>
              <Badge size="sm">{student.status}</Badge>
            </div>
            <div className="mt-3 space-y-1 text-sm text-text-secondary">
              <p>{student.streamName}</p>
              <p>{student.gender} · {student.parentPhone}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <Link to={onView || `/admin/students/${student.id}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
            <FiEye size={14} /> View
          </Link>
          <Link to={onEdit || `/admin/students/${student.id}/edit`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-slate-200">
            <FiEdit2 size={14} /> Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export function StreamCard({ stream, onView, onEdit }) {
  const utilization = Math.round((stream.studentCount / stream.capacity) * 100);
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-accent to-teal-400" />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-primary">{stream.name}</h3>
            <p className="text-sm text-text-secondary">{stream.classLevel}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <FiUsers size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-text-secondary">Capacity</span>
            <span className="font-semibold">{stream.studentCount}/{stream.capacity}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-teal-400 transition-all" style={{ width: `${utilization}%` }} />
          </div>
        </div>
        <p className="mt-3 text-sm text-text-secondary">Teacher: <span className="font-medium text-text-primary">{stream.classTeacher}</span></p>
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <Link to={onView || `/admin/streams/${stream.id}`} className="text-xs font-semibold text-primary hover:underline">View Details</Link>
          <span className="text-slate-300">·</span>
          <Link to={onEdit || `/admin/streams/${stream.id}/edit`} className="text-xs font-semibold text-text-secondary hover:underline">Edit</Link>
        </div>
      </div>
    </div>
  );
}

export function SubjectCard({ subject, onView, onEdit }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary to-violet-500" />
      <div className="p-5">
        <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold tracking-wide text-primary">{subject.code}</span>
        <h3 className="mt-3 font-bold text-text-primary">{subject.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">{subject.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="text-text-secondary">{subject.teacher}</span>
          <div className="flex gap-3">
            <Link to={onView || `/admin/subjects/${subject.id}`} className="text-xs font-semibold text-primary hover:underline">View</Link>
            <Link to={onEdit || `/admin/subjects/${subject.id}/edit`} className="text-xs font-semibold text-text-secondary hover:underline">Edit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
