import api, { getErrorMessage } from './api';

export const classStreamService = {
  async getAll(params = {}) {
    const { data } = await api.get('/streams', { params });
    return data;
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/streams/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/streams', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/streams/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/streams/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getAllSimple() {
    const { data } = await api.get('/streams/simple');
    return data;
  },
};
