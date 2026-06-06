import { attendanceRecords, students, generateId, delay } from './mockData';

let recordsStore = [...attendanceRecords];

export const attendanceService = {
  async getByStreamAndDate(streamId, date) {
    await delay();
    const streamStudents = students.filter((s) => s.streamId === Number(streamId));
    const dateRecords = recordsStore.filter(
      (r) => r.streamId === Number(streamId) && r.date === date,
    );

    return streamStudents.map((student) => {
      const record = dateRecords.find((r) => r.studentId === student.id);
      return {
        studentId: student.id,
        admissionNumber: student.admissionNumber,
        name: `${student.firstName} ${student.lastName}`,
        status: record?.status || 'Present',
        recordId: record?.id || null,
      };
    });
  },

  async saveAttendance({ streamId, date, records }) {
    await delay();
    records.forEach(({ studentId, status }) => {
      const existing = recordsStore.find(
        (r) =>
          r.studentId === Number(studentId) &&
          r.streamId === Number(streamId) &&
          r.date === date,
      );
      if (existing) {
        existing.status = status;
      } else {
        recordsStore.push({
          id: generateId(),
          studentId: Number(studentId),
          streamId: Number(streamId),
          date,
          status,
        });
      }
    });
    return { success: true };
  },

  async getStudentSummary(studentId) {
    await delay();
    const records = recordsStore.filter((r) => r.studentId === Number(studentId));
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const total = records.length || 1;
    return {
      present,
      absent,
      late,
      total: records.length,
      rate: Math.round((present / total) * 100),
      records: records.slice(-10).reverse(),
    };
  },

  async getStreamStats(streamId) {
    await delay();
    const records = recordsStore.filter((r) => r.streamId === Number(streamId));
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = records.filter((r) => r.date === today);
    return {
      todayPresent: todayRecords.filter((r) => r.status === 'Present').length,
      todayAbsent: todayRecords.filter((r) => r.status === 'Absent').length,
      todayLate: todayRecords.filter((r) => r.status === 'Late').length,
    };
  },
};
