import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import { getGradeRemark } from '../../utils/grades';
import { APP_NAME } from '../../utils/constants';

export default function ReportCardPrint({ report, className = '' }) {
  if (!report) return null;
  const { student, results, summary, teacherComment } = report;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-8 shadow-sm print:shadow-none ${className}`}>
      <div className="border-b-2 border-primary pb-4 text-center">
        <h1 className="text-2xl font-bold text-primary">{APP_NAME}</h1>
        <p className="text-sm text-text-secondary">Excellence in Education · P.O. Box 12345, Nairobi</p>
        <h2 className="mt-3 text-lg font-semibold text-text-primary">STUDENT REPORT CARD</h2>
        <p className="text-sm text-text-secondary">Term 1 · 2024 Academic Year</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div><span className="text-text-secondary">Name:</span> <strong>{student.firstName} {student.lastName}</strong></div>
        <div><span className="text-text-secondary">Adm No:</span> <strong>{student.admissionNumber}</strong></div>
        <div><span className="text-text-secondary">Class:</span> <strong>{student.streamName}</strong></div>
        <div><span className="text-text-secondary">Gender:</span> <strong>{student.gender}</strong></div>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50">
            <th className="px-3 py-2 text-left font-semibold">Subject</th>
            <th className="px-3 py-2 text-center font-semibold">CAT</th>
            <th className="px-3 py-2 text-center font-semibold">Exam</th>
            <th className="px-3 py-2 text-center font-semibold">Total</th>
            <th className="px-3 py-2 text-center font-semibold">Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.subjectId} className="border-b border-slate-100">
              <td className="px-3 py-2">{r.subjectName}</td>
              <td className="px-3 py-2 text-center">{r.cat}</td>
              <td className="px-3 py-2 text-center">{r.exam}</td>
              <td className="px-3 py-2 text-center font-medium">{r.total}</td>
              <td className="px-3 py-2 text-center"><Badge>{r.grade}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
        <div><p className="text-xs text-text-secondary">Total Marks</p><p className="text-lg font-bold">{summary.totalMarks}</p></div>
        <div><p className="text-xs text-text-secondary">Average</p><p className="text-lg font-bold">{summary.average}%</p></div>
        <div><p className="text-xs text-text-secondary">Position</p><p className="text-lg font-bold">{summary.position}</p></div>
        <div><p className="text-xs text-text-secondary">Overall Grade</p><p className="text-lg font-bold"><Badge>{summary.grade}</Badge></p></div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-text-primary">Remarks: {getGradeRemark(summary.grade)}</p>
        <p className="mt-2 text-sm text-text-secondary"><strong>Class Teacher Comment:</strong> {teacherComment}</p>
      </div>

      <div className="mt-10 flex justify-between text-sm">
        <div className="text-center">
          <div className="mb-8 border-b border-slate-300 w-48" />
          <p className="text-text-secondary">Class Teacher Signature</p>
        </div>
        <div className="text-center">
          <div className="mb-8 border-b border-slate-300 w-48" />
          <p className="text-text-secondary">Principal Signature</p>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text-secondary">Generated on {formatDate(new Date())}</p>
    </div>
  );
}
