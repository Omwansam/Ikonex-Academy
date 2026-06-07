import api, { getErrorMessage } from './api';

export const notificationService = {
  async getAll({ role, studentId } = {}) {
    const params = {};
    if (role) params.role = role;
    if (studentId) params.studentId = studentId;
    const { data } = await api.get('/notifications', { params });
    return data;
  },

  async markAsRead(id) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllAsRead({ role, studentId } = {}) {
    const { data } = await api.post('/notifications/read-all', { role, studentId });
    return data;
  },

  async getUnreadCount({ role, studentId } = {}) {
    const params = {};
    if (role) params.role = role;
    if (studentId) params.studentId = studentId;
    const { data } = await api.get('/notifications/unread-count', { params });
    return data;
  },

  async create(payload) {
    try {
      const { data } = await api.post('/notifications', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export const settingsService = {
  async get() {
    const { data } = await api.get('/settings');
    return data;
  },

  async update(payload) {
    try {
      const { data } = await api.put('/settings', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
