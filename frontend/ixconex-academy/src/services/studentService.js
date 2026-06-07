import api, { getErrorMessage } from './api';

export const studentService = {
  async getAll(params = {}) {
    const { data } = await api.get('/students', { params });
    return data;
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/students/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/students', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/students/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/students/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getStats() {
    const { data } = await api.get('/students/stats');
    return data;
  },
};
