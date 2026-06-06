import { teachers, generateId, paginate, delay } from './mockData';

let teachersStore = [...teachers];

export const teacherService = {
  async getAll(params = {}) {
    await delay();
    let filtered = [...teachersStore];
    const { search, status, page = 1, pageSize = 10 } = params;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q),
      );
    }
    if (status) filtered = filtered.filter((t) => t.status === status);

    return paginate(filtered, page, pageSize);
  },

  async getById(id) {
    await delay();
    const teacher = teachersStore.find((t) => t.id === Number(id));
    if (!teacher) throw new Error('Teacher not found');
    return teacher;
  },

  async create(data) {
    await delay();
    const newTeacher = { id: generateId(), status: 'Active', ...data };
    teachersStore.push(newTeacher);
    return newTeacher;
  },

  async update(id, data) {
    await delay();
    const index = teachersStore.findIndex((t) => t.id === Number(id));
    if (index === -1) throw new Error('Teacher not found');
    teachersStore[index] = { ...teachersStore[index], ...data };
    return teachersStore[index];
  },

  async delete(id) {
    await delay();
    const index = teachersStore.findIndex((t) => t.id === Number(id));
    if (index === -1) throw new Error('Teacher not found');
    teachersStore.splice(index, 1);
    return { success: true };
  },
};
