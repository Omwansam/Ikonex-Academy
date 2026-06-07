import api, { getErrorMessage } from './api';

export const DEMO_STUDENT_PASSWORD = 'student123';

export const authService = {
  async loginAdmin(credentials) {
    try {
      const { data } = await api.post('/auth/admin/login', credentials);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async loginStudent(credentials) {
    try {
      const { data } = await api.post('/auth/student/login', credentials);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async forgotPassword(email) {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async resetPassword(payload) {
    try {
      const { data } = await api.post('/auth/reset-password', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
