import { notifications, schoolSettings, generateId, delay } from './mockData';

let notificationsStore = [...notifications];
let settingsStore = { ...schoolSettings };

export const notificationService = {
  async getAll({ role, studentId } = {}) {
    await delay();
    return notificationsStore
      .filter((n) => {
        if (n.audience === 'all') return true;
        if (role === 'admin') return n.audience === 'admin';
        if (role === 'student') {
          return n.audience === 'student' && (!n.studentId || n.studentId === studentId);
        }
        return false;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async markAsRead(id) {
    await delay();
    const notification = notificationsStore.find((n) => n.id === Number(id));
    if (notification) notification.read = true;
    return notification;
  },

  async markAllAsRead({ role, studentId }) {
    await delay();
    const list = await this.getAll({ role, studentId });
    list.forEach((n) => { n.read = true; });
    return { success: true };
  },

  async getUnreadCount({ role, studentId }) {
    const list = await this.getAll({ role, studentId });
    return list.filter((n) => !n.read).length;
  },

  async create(data) {
    await delay();
    const notification = {
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    notificationsStore.unshift(notification);
    return notification;
  },
};

export const settingsService = {
  async get() {
    await delay();
    return { ...settingsStore };
  },

  async update(data) {
    await delay();
    settingsStore = { ...settingsStore, ...data };
    return settingsStore;
  },
};
