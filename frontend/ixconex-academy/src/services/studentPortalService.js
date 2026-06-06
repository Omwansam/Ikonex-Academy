import {
  students,
  subjects,
  classStreams,
  studentResults,
  rankings,
  assessments,
  scores,
  studentAssessmentDetails,
  timetables,
  feeRecords,
  schoolEvents,
  studentPerformanceHistory,
  schoolSettings,
  notifications,
  delay,
} from './mockData';
import { attendanceService } from './attendanceService';
import { reportService } from './reportService';
import { notificationService } from './notificationService';

export const studentPortalService = {
  async getDashboard(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    if (!student) throw new Error('Student not found');

    const results = studentResults.filter((r) => r.studentId === Number(studentId));
    const ranking = rankings.find((r) => r.studentId === Number(studentId));
    const attendance = await attendanceService.getStudentSummary(studentId);
    const notifs = await notificationService.getAll({ role: 'student', studentId: Number(studentId) });
    const upcoming = studentAssessmentDetails
      .filter((a) => a.studentId === Number(studentId) && a.status === 'Upcoming')
      .slice(0, 3);
    const perfHistory = studentPerformanceHistory[studentId] || studentPerformanceHistory[1];
    const stream = classStreams.find((s) => s.id === student.streamId);
    const fees = feeRecords.filter((f) => f.studentId === Number(studentId));
    const balance = fees.reduce((sum, f) => sum + (f.amount - f.paid), 0);

    const total = results.reduce((s, r) => s + r.total, 0);
    const average = results.length ? (total / results.length).toFixed(1) : 0;

    return {
      student,
      stream,
      stats: {
        className: student.streamName,
        average,
        position: ranking?.position || '—',
        subjectsCount: results.length,
        attendanceRate: attendance.rate,
        feeBalance: balance,
      },
      results,
      ranking,
      attendance,
      notifications: notifs.slice(0, 4),
      upcomingAssessments: upcoming,
      performanceTrend: perfHistory,
      recentEvents: schoolEvents.slice(0, 3),
      term: schoolSettings.currentTerm,
    };
  },

  async getProfile(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    if (!student) throw new Error('Student not found');
    const stream = classStreams.find((s) => s.id === student.streamId);
    return { student, stream, settings: schoolSettings };
  },

  async updateProfile(studentId, data) {
    await delay();
    const index = students.findIndex((s) => s.id === Number(studentId));
    if (index === -1) throw new Error('Student not found');
    const allowed = ['parentPhone', 'parentEmail', 'parentName'];
    allowed.forEach((key) => {
      if (data[key] !== undefined) students[index][key] = data[key];
    });
    return students[index];
  },

  async getSubjects(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    const streamSubjects = subjects.filter((s) => s.streamIds.includes(student.streamId));
    const results = studentResults.filter((r) => r.studentId === Number(studentId));

    return streamSubjects.map((subject) => {
      const result = results.find((r) => r.subjectId === subject.id);
      return {
        ...subject,
        grade: result?.grade || '—',
        total: result?.total || null,
        maxTotal: result?.maxTotal || null,
        cat: result?.cat || null,
        exam: result?.exam || null,
      };
    });
  },

  async getSubjectDetail(studentId, subjectId) {
    await delay();
    const subject = subjects.find((s) => s.id === Number(subjectId));
    if (!subject) throw new Error('Subject not found');
    const result = studentResults.find(
      (r) => r.studentId === Number(studentId) && r.subjectId === Number(subjectId),
    );
    const studentAssessments = studentAssessmentDetails.filter(
      (a) => a.studentId === Number(studentId) && a.subjectName === subject.name,
    );
    return { subject, result, assessments: studentAssessments };
  },

  async getResults(studentId, term) {
    await delay();
    let results = studentResults.filter((r) => r.studentId === Number(studentId));
    const ranking = rankings.find((r) => r.studentId === Number(studentId));
    const total = results.reduce((s, r) => s + r.total, 0);
    const maxTotal = results.reduce((s, r) => s + r.maxTotal, 0);
    const average = results.length ? ((total / maxTotal) * 100).toFixed(1) : 0;
    const gradeCounts = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {});

    return { results, summary: { total, maxTotal, average, position: ranking?.position, gradeCounts }, term: term || schoolSettings.currentTerm };
  },

  async getAssessments(studentId) {
    await delay();
    const list = studentAssessmentDetails.filter((a) => a.studentId === Number(studentId));
    return {
      upcoming: list.filter((a) => a.status === 'Upcoming'),
      graded: list.filter((a) => a.status === 'Graded'),
      all: list,
    };
  },

  async getTimetable(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    const schedule = timetables[student.streamId] || timetables[1];
    const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
    const todaySchedule = schedule.find((d) => d.day === today) || schedule[0];
    return { schedule, today: todaySchedule, streamName: student.streamName };
  },

  async getRankings(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    const classRankings = rankings.filter((r) => r.stream === student.streamName);
    const myRank = classRankings.find((r) => r.studentId === Number(studentId))
      || rankings.find((r) => r.studentId === Number(studentId));
    return { classRankings, myRank, overallRankings: rankings.slice(0, 10) };
  },

  async getFees(studentId) {
    await delay();
    const fees = feeRecords.filter((f) => f.studentId === Number(studentId));
    const totalDue = fees.reduce((s, f) => s + f.amount, 0);
    const totalPaid = fees.reduce((s, f) => s + f.paid, 0);
    const balance = totalDue - totalPaid;
    return { fees, summary: { totalDue, totalPaid, balance } };
  },

  async getEvents() {
    await delay();
    const now = new Date();
    return schoolEvents
      .map((e) => ({ ...e, isPast: new Date(e.date) < now }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  async getReportCard(studentId) {
    return reportService.getReportCard(studentId);
  },

  async changePassword(studentId, { currentPassword, newPassword }) {
    await delay();
    if (!currentPassword || !newPassword) throw new Error('All fields are required');
    if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
    if (currentPassword !== 'student123') throw new Error('Current password is incorrect');
    return { message: 'Password changed successfully' };
  },
};
