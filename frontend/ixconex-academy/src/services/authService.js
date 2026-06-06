import { adminUser, students, delay } from './mockData';

export const DEMO_STUDENT_PASSWORD = 'student123';

function normalizeAdmissionNumber(value) {
  return String(value || '').trim().toUpperCase();
}

function buildStudentUser(student) {
  return {
    id: student.id,
    studentId: student.id,
    admissionNumber: student.admissionNumber,
    name: `${student.firstName} ${student.lastName}`,
    role: 'student',
  };
}

export const authService = {
  async loginAdmin(credentials) {
    await delay();
    const email = String(credentials.email || '').trim().toLowerCase();
    const password = String(credentials.password || '').trim();

    if (email === adminUser.email && password === adminUser.password) {
      const { password: _, ...user } = adminUser;
      return { user, token: 'mock-admin-token' };
    }
    throw new Error('Invalid email or password');
  },

  async loginStudent(credentials) {
    await delay();
    const admissionNumber = normalizeAdmissionNumber(credentials.admissionNumber);
    const password = String(credentials.password || '').trim();

    if (!admissionNumber) {
      throw new Error('Admission number is required');
    }

    const student = students.find(
      (s) => normalizeAdmissionNumber(s.admissionNumber) === admissionNumber,
    );

    if (!student) {
      throw new Error('No student found with this admission number');
    }

    if (student.status !== 'Active') {
      throw new Error('Your account is inactive. Contact the school office.');
    }

    if (password !== DEMO_STUDENT_PASSWORD) {
      throw new Error('Invalid admission number or password');
    }

    return { user: buildStudentUser(student), token: 'mock-student-token' };
  },

  async forgotPassword(email) {
    await delay();
    if (!email) throw new Error('Email is required');
    return { message: 'Password reset link sent to your email' };
  },

  async resetPassword({ token, password }) {
    await delay();
    if (!token || !password) throw new Error('Invalid reset request');
    return { message: 'Password reset successfully' };
  },
};
