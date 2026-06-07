import api, { getErrorMessage } from './api';

export const teacherService = {
  async getAll(params = {}) {
    const { data } = await api.get('/teachers', { params });
    return data;
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/teachers/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/teachers', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/teachers/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/teachers/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
