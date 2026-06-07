import api, { getErrorMessage } from './api';

export const attendanceService = {
  async getByStreamAndDate(streamId, date) {
    const { data } = await api.get('/attendance', { params: { streamId, date } });
    return data;
  },

  async saveAttendance(payload) {
    try {
      const { data } = await api.post('/attendance', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getStudentSummary(studentId) {
    const { data } = await api.get(`/attendance/student/${studentId}/summary`);
    return data;
  },

  async getStreamStats(streamId) {
    const { data } = await api.get(`/attendance/streams/${streamId}/stats`);
    return data;
  },
};
