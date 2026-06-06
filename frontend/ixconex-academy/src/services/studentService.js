import {
  students,
  generateId,
  paginate,
  delay,
} from './mockData';

let studentsStore = [...students];

export const studentService = {
  async getAll(params = {}) {
    await delay();
    let filtered = [...studentsStore];
    const { search, streamId, status, page = 1, pageSize = 10 } = params;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.admissionNumber.toLowerCase().includes(q),
      );
    }
    if (streamId) filtered = filtered.filter((s) => s.streamId === Number(streamId));
    if (status) filtered = filtered.filter((s) => s.status === status);

    return paginate(filtered, page, pageSize);
  },

  async getById(id) {
    await delay();
    const student = studentsStore.find((s) => s.id === Number(id));
    if (!student) throw new Error('Student not found');
    return student;
  },

  async create(data) {
    await delay();
    const stream = data.streamName || 'Unassigned';
    const newStudent = {
      id: generateId(),
      ...data,
      streamName: stream,
      status: data.status || 'Active',
      profileImage: data.profileImage || null,
    };
    studentsStore.push(newStudent);
    return newStudent;
  },

  async update(id, data) {
    await delay();
    const index = studentsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Student not found');
    studentsStore[index] = { ...studentsStore[index], ...data };
    return studentsStore[index];
  },

  async delete(id) {
    await delay();
    const index = studentsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Student not found');
    studentsStore.splice(index, 1);
    return { success: true };
  },

  async getStats() {
    await delay();
    return {
      total: studentsStore.length,
      active: studentsStore.filter((s) => s.status === 'Active').length,
      inactive: studentsStore.filter((s) => s.status !== 'Active').length,
    };
  },
};
