import api from './api';

export const reportService = {
  async getDashboardStats() {
    const { data } = await api.get('/reports/dashboard/stats');
    return data;
  },

  async getRecentActivities() {
    const { data } = await api.get('/reports/dashboard/activities');
    return data;
  },

  async getPerformanceTrends() {
    const { data } = await api.get('/reports/performance-trends');
    return data;
  },

  async getSubjectPerformance() {
    const { data } = await api.get('/reports/subject-performance');
    return data;
  },

  async getStreamDistribution() {
    const { data } = await api.get('/reports/stream-distribution');
    return data;
  },

  async getGradeDistribution() {
    const { data } = await api.get('/reports/grade-distribution');
    return data;
  },

  async getStudentResults(studentId) {
    const { data } = await api.get(`/reports/students/${studentId}/results`);
    return data;
  },

  async getClassResults(streamId) {
    const { data } = await api.get(`/reports/streams/${streamId}/results`);
    return data;
  },

  async getSubjectResults(subjectId) {
    const { data } = await api.get(`/reports/subjects/${subjectId}/results`);
    return data;
  },

  async getRankings(params = {}) {
    const { data } = await api.get('/reports/rankings', { params });
    return data;
  },

  async getReportCard(studentId) {
    const { data } = await api.get(`/reports/students/${studentId}/report-card`);
    return data;
  },

  async getTopStudents(limit = 5) {
    const { data } = await api.get('/reports/top-students', { params: { limit } });
    return data;
  },

  async getBottomStudents(limit = 5) {
    const { data } = await api.get('/reports/bottom-students', { params: { limit } });
    return data;
  },
};
