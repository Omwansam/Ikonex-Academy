import {
  dashboardStats,
  recentActivities,
  performanceTrends,
  subjectPerformance,
  streamDistribution,
  gradeDistribution,
  studentResults,
  rankings,
  students,
  delay,
} from './mockData';

export const reportService = {
  async getDashboardStats() {
    await delay();
    return dashboardStats;
  },

  async getRecentActivities() {
    await delay();
    return recentActivities;
  },

  async getPerformanceTrends() {
    await delay();
    return performanceTrends;
  },

  async getSubjectPerformance() {
    await delay();
    return subjectPerformance;
  },

  async getStreamDistribution() {
    await delay();
    return streamDistribution;
  },

  async getGradeDistribution() {
    await delay();
    return gradeDistribution;
  },

  async getStudentResults(studentId) {
    await delay();
    return studentResults.filter((r) => r.studentId === Number(studentId));
  },

  async getClassResults(streamId) {
    await delay();
    const streamStudents = students.filter((s) => s.streamId === Number(streamId));
    return streamStudents.map((student) => {
      const results = studentResults.filter((r) => r.studentId === student.id);
      const total = results.reduce((sum, r) => sum + r.total, 0);
      const average = results.length ? total / results.length : 0;
      return {
        studentId: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        total,
        average: average.toFixed(1),
        subjects: results.length,
      };
    });
  },

  async getSubjectResults(subjectId) {
    await delay();
    return studentResults.filter((r) => r.subjectId === Number(subjectId));
  },

  async getRankings(params = {}) {
    await delay();
    let filtered = [...rankings];
    if (params.streamId) {
      const stream = students.find((s) => s.streamId === Number(params.streamId));
      if (stream) {
        filtered = filtered.filter((r) => r.stream === stream.streamName);
      }
    }
    return filtered;
  },

  async getReportCard(studentId) {
    await delay();
    const student = students.find((s) => s.id === Number(studentId));
    if (!student) throw new Error('Student not found');
    const results = studentResults.filter((r) => r.studentId === Number(studentId));
    const totalMarks = results.reduce((sum, r) => sum + r.total, 0);
    const average = results.length ? (totalMarks / results.length).toFixed(1) : 0;
    const ranking = rankings.find((r) => r.studentId === Number(studentId));
    return {
      student,
      results,
      summary: {
        totalMarks,
        average,
        position: ranking?.position || '—',
        grade: average >= 80 ? 'A' : average >= 70 ? 'B' : average >= 60 ? 'C' : average >= 50 ? 'D' : 'E',
      },
      teacherComment: 'Shows great improvement. Keep up the good work.',
    };
  },

  async getTopStudents(limit = 5) {
    await delay();
    return rankings.slice(0, limit);
  },

  async getBottomStudents(limit = 5) {
    await delay();
    return [...rankings].reverse().slice(0, limit);
  },
};
