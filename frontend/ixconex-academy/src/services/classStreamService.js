import {
  classStreams,
  generateId,
  paginate,
  delay,
} from './mockData';

let streamsStore = [...classStreams];

export const classStreamService = {
  async getAll(params = {}) {
    await delay();
    let filtered = [...streamsStore];
    const { search, classLevel, page = 1, pageSize = 10 } = params;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.classTeacher.toLowerCase().includes(q),
      );
    }
    if (classLevel) filtered = filtered.filter((s) => s.classLevel === classLevel);

    return paginate(filtered, page, pageSize);
  },

  async getById(id) {
    await delay();
    const stream = streamsStore.find((s) => s.id === Number(id));
    if (!stream) throw new Error('Class stream not found');
    return stream;
  },

  async create(data) {
    await delay();
    const newStream = {
      id: generateId(),
      ...data,
      studentCount: 0,
    };
    streamsStore.push(newStream);
    return newStream;
  },

  async update(id, data) {
    await delay();
    const index = streamsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Class stream not found');
    streamsStore[index] = { ...streamsStore[index], ...data };
    return streamsStore[index];
  },

  async delete(id) {
    await delay();
    const index = streamsStore.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error('Class stream not found');
    streamsStore.splice(index, 1);
    return { success: true };
  },

  async getAllSimple() {
    await delay();
    return streamsStore.map(({ id, name, classLevel }) => ({ id, name, classLevel }));
  },
};
