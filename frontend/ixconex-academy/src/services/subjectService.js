import {
  subjects,
  teachers,
  generateId,
  paginate,
  delay,
} from './mockData';

let subjectsStore = [...subjects];

export const subjectService = {
  async getAll(params = {}) {
    await delay();
    let filtered = [...subjectsStore];
    const { search, page = 1, pageSize = 10 } = params;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.teacher.toLowerCase().includes(q),
      );
    }

    return paginate(filtered, page, pageSize);
  },

  async getById(id) {
    await delay();
    const subject = subjectsStore.find((s) => s.id === Number(id));
    if (!subject) throw new Error('Subject not found');
    return subject;
  },

  async create(data) {
    await delay();
    const newSubject = { id: generateId(), streamIds: data.streamIds || [], ...data };
    subjectsStore.push(newSubject);
    return newSubject;
  },

  async update(id, data) {
    await delay();
    const index = subjectsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Subject not found');
    subjectsStore[index] = { ...subjectsStore[index], ...data };
    return subjectsStore[index];
  },

  async delete(id) {
    await delay();
    const index = subjectsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Subject not found');
    subjectsStore.splice(index, 1);
    return { success: true };
  },

  async getTeachers() {
    await delay();
    return teachers;
  },

  async getStats() {
    await delay();
    return { total: subjectsStore.length };
  },
};
