import api, { getErrorMessage } from './api';

export const studentPortalService = {
  async getDashboard() {
    const { data } = await api.get('/student/dashboard');
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/student/profile');
    return data;
  },

  async updateProfile(_studentId, payload) {
    try {
      const { data } = await api.put('/student/profile', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSubjects() {
    const { data } = await api.get('/student/subjects');
    return data;
  },

  async getSubjectDetail(_studentId, subjectId) {
    const { data } = await api.get(`/student/subjects/${subjectId}`);
    return data;
  },

  async getResults(_studentId, term) {
    const params = term ? { term } : {};
    const { data } = await api.get('/student/results', { params });
    return data;
  },

  async getAssessments() {
    const { data } = await api.get('/student/assessments');
    return data;
  },

  async getTimetable() {
    const { data } = await api.get('/student/timetable');
    return data;
  },

  async getRankings() {
    const { data } = await api.get('/student/rankings');
    return data;
  },

  async getFees() {
    const { data } = await api.get('/student/fees');
    return data;
  },

  async getEvents() {
    const { data } = await api.get('/student/events');
    return data;
  },

  async getReportCard() {
    const { data } = await api.get('/student/report-card');
    return data;
  },

  async changePassword(_studentId, { currentPassword, newPassword }) {
    try {
      const { data } = await api.put('/student/change-password', { currentPassword, newPassword });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
