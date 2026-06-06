import {
  assessments,
  scores,
  generateId,
  paginate,
  delay,
} from './mockData';

let assessmentsStore = [...assessments];
let scoresStore = [...scores];

export const assessmentService = {
  async getAll(params = {}) {
    await delay();
    let filtered = [...assessmentsStore];
    const { search, type, streamId, page = 1, pageSize = 10 } = params;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q),
      );
    }
    if (type) filtered = filtered.filter((a) => a.type === type);
    if (streamId) filtered = filtered.filter((a) => a.streamId === Number(streamId));

    return paginate(filtered, page, pageSize);
  },

  async getById(id) {
    await delay();
    const assessment = assessmentsStore.find((a) => a.id === Number(id));
    if (!assessment) throw new Error('Assessment not found');
    return assessment;
  },

  async create(data) {
    await delay();
    const newAssessment = { id: generateId(), ...data };
    assessmentsStore.push(newAssessment);
    return newAssessment;
  },

  async update(id, data) {
    await delay();
    const index = assessmentsStore.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error('Assessment not found');
    assessmentsStore[index] = { ...assessmentsStore[index], ...data };
    return assessmentsStore[index];
  },

  async delete(id) {
    await delay();
    const index = assessmentsStore.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error('Assessment not found');
    assessmentsStore.splice(index, 1);
    return { success: true };
  },

  async getScores(assessmentId) {
    await delay();
    return scoresStore.filter((s) => s.assessmentId === Number(assessmentId));
  },

  async submitScore(data) {
    await delay();
    const { assessmentId, studentId, score } = data;
    const existing = scoresStore.find(
      (s) => s.assessmentId === Number(assessmentId) && s.studentId === Number(studentId),
    );
    if (existing) {
      throw new Error('Score already submitted for this student');
    }
    const newScore = { id: generateId(), assessmentId: Number(assessmentId), studentId: Number(studentId), score: Number(score) };
    scoresStore.push(newScore);
    return newScore;
  },

  async updateScore(id, score) {
    await delay();
    const index = scoresStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Score not found');
    scoresStore[index].score = Number(score);
    return scoresStore[index];
  },
};
