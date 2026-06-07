import api, { getErrorMessage } from './api';

export const assessmentService = {
  async getAll(params = {}) {
    const { data } = await api.get('/assessments', { params });
    return data;
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/assessments/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/assessments', payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/assessments/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/assessments/${id}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getScores(assessmentId) {
    const { data } = await api.get(`/assessments/${assessmentId}/scores`);
    return data;
  },

  async submitScore({ assessmentId, studentId, score }) {
    try {
      const { data } = await api.post(`/assessments/${assessmentId}/scores`, { studentId, score });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateScore(id, score) {
    try {
      const { data } = await api.put(`/scores/${id}`, { score });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
