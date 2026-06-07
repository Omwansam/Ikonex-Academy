import api, { getErrorMessage } from './api';

export const subjectService = {
  async getAll(params = {}) {
    const { data } = await api.get('/subjects', { params });
    return data;
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/subjects/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/subjects', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/subjects/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/subjects/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getTeachers() {
    const { data } = await api.get('/teachers', { params: { pageSize: 500 } });
    return data.data;
  },

  async getStats() {
    const { data } = await api.get('/subjects/stats');
    return data;
  },
};
