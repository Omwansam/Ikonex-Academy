let idCounter = 100;

export function generateId() {
  idCounter += 1;
  return idCounter;
}

export const teachers = [
  { id: 1, name: 'Mr. James Ochieng', email: 'j.ochieng@ikonex.ac.ke', phone: '0712345678', subject: 'Mathematics', status: 'Active' },
  { id: 2, name: 'Mrs. Grace Wanjiku', email: 'g.wanjiku@ikonex.ac.ke', phone: '0723456789', subject: 'English', status: 'Active' },
  { id: 3, name: 'Mr. Peter Kamau', email: 'p.kamau@ikonex.ac.ke', phone: '0734567890', subject: 'Kiswahili', status: 'Active' },
  { id: 4, name: 'Ms. Faith Akinyi', email: 'f.akinyi@ikonex.ac.ke', phone: '0745678901', subject: 'Physics', status: 'Active' },
  { id: 5, name: 'Mr. David Mutua', email: 'd.mutua@ikonex.ac.ke', phone: '0756789012', subject: 'Chemistry', status: 'Active' },
];

export const classStreams = [
  { id: 1, name: 'Form 1A', classLevel: 'Form 1', capacity: 40, classTeacherId: 1, classTeacher: 'Mr. James Ochieng', studentCount: 38 },
  { id: 2, name: 'Form 1B', classLevel: 'Form 1', capacity: 40, classTeacherId: 2, classTeacher: 'Mrs. Grace Wanjiku', studentCount: 35 },
  { id: 3, name: 'Form 2A', classLevel: 'Form 2', capacity: 40, classTeacherId: 3, classTeacher: 'Mr. Peter Kamau', studentCount: 36 },
  { id: 4, name: 'Form 2B', classLevel: 'Form 2', capacity: 40, classTeacherId: 4, classTeacher: 'Ms. Faith Akinyi', studentCount: 34 },
  { id: 5, name: 'Form 3A', classLevel: 'Form 3', capacity: 35, classTeacherId: 5, classTeacher: 'Mr. David Mutua', studentCount: 32 },
  { id: 6, name: 'Form 4A', classLevel: 'Form 4', capacity: 35, classTeacherId: 1, classTeacher: 'Mr. James Ochieng', studentCount: 30 },
];

export const subjects = [
  { id: 1, code: 'MATH', name: 'Mathematics', description: 'Core mathematics curriculum', teacherId: 1, teacher: 'Mr. James Ochieng', streamIds: [1, 2, 3, 4, 5, 6] },
  { id: 2, code: 'ENG', name: 'English', description: 'Language and literature', teacherId: 2, teacher: 'Mrs. Grace Wanjiku', streamIds: [1, 2, 3, 4, 5, 6] },
  { id: 3, code: 'KIS', name: 'Kiswahili', description: 'National language studies', teacherId: 3, teacher: 'Mr. Peter Kamau', streamIds: [1, 2, 3, 4, 5, 6] },
  { id: 4, code: 'PHY', name: 'Physics', description: 'Physical sciences', teacherId: 4, teacher: 'Ms. Faith Akinyi', streamIds: [3, 4, 5, 6] },
  { id: 5, code: 'CHEM', name: 'Chemistry', description: 'Chemical sciences', teacherId: 5, teacher: 'Mr. David Mutua', streamIds: [3, 4, 5, 6] },
  { id: 6, code: 'BIO', name: 'Biology', description: 'Life sciences', teacherId: 1, teacher: 'Mr. James Ochieng', streamIds: [1, 2, 3, 4, 5, 6] },
  { id: 7, code: 'HIST', name: 'History', description: 'Historical studies', teacherId: 2, teacher: 'Mrs. Grace Wanjiku', streamIds: [1, 2, 3, 4] },
  { id: 8, code: 'GEO', name: 'Geography', description: 'Earth and environment', teacherId: 3, teacher: 'Mr. Peter Kamau', streamIds: [1, 2, 3, 4, 5, 6] },
];

export const students = [
  { id: 1, admissionNumber: 'IKX2024001', firstName: 'Brian', lastName: 'Otieno', gender: 'Male', nationality: 'Kenyan', dateOfBirth: '2008-03-15', streamId: 1, streamName: 'Form 1A', admissionDate: '2024-01-08', parentName: 'Mary Otieno', parentPhone: '0711223344', parentEmail: 'mary.otieno@email.com', status: 'Active', profileImage: null },
  { id: 2, admissionNumber: 'IKX2024002', firstName: 'Sarah', lastName: 'Mwangi', gender: 'Female', nationality: 'Kenyan', dateOfBirth: '2008-07-22', streamId: 1, streamName: 'Form 1A', admissionDate: '2024-01-08', parentName: 'John Mwangi', parentPhone: '0722334455', parentEmail: 'john.mwangi@email.com', status: 'Active', profileImage: null },
  { id: 3, admissionNumber: 'IKX2024003', firstName: 'Kevin', lastName: 'Kipchoge', gender: 'Male', nationality: 'Kenyan', dateOfBirth: '2007-11-05', streamId: 2, streamName: 'Form 1B', admissionDate: '2024-01-08', parentName: 'Jane Kipchoge', parentPhone: '0733445566', parentEmail: 'jane.kip@email.com', status: 'Active', profileImage: null },
  { id: 4, admissionNumber: 'IKX2023010', firstName: 'Grace', lastName: 'Njeri', gender: 'Female', nationality: 'Kenyan', dateOfBirth: '2007-05-18', streamId: 3, streamName: 'Form 2A', admissionDate: '2023-01-09', parentName: 'Peter Njeri', parentPhone: '0744556677', parentEmail: 'peter.njeri@email.com', status: 'Active', profileImage: null },
  { id: 5, admissionNumber: 'IKX2023011', firstName: 'Daniel', lastName: 'Mutiso', gender: 'Male', nationality: 'Kenyan', dateOfBirth: '2007-09-30', streamId: 3, streamName: 'Form 2A', admissionDate: '2023-01-09', parentName: 'Lucy Mutiso', parentPhone: '0755667788', parentEmail: 'lucy.m@email.com', status: 'Active', profileImage: null },
  { id: 6, admissionNumber: 'IKX2023012', firstName: 'Faith', lastName: 'Wambui', gender: 'Female', nationality: 'Kenyan', dateOfBirth: '2006-12-12', streamId: 5, streamName: 'Form 3A', admissionDate: '2022-01-10', parentName: 'Samuel Wambui', parentPhone: '0766778899', parentEmail: 'sam.w@email.com', status: 'Active', profileImage: null },
  { id: 7, admissionNumber: 'IKX2022005', firstName: 'Michael', lastName: 'Omondi', gender: 'Male', nationality: 'Kenyan', dateOfBirth: '2006-04-25', streamId: 6, streamName: 'Form 4A', admissionDate: '2021-01-11', parentName: 'Rose Omondi', parentPhone: '0777889900', parentEmail: 'rose.o@email.com', status: 'Active', profileImage: null },
  { id: 8, admissionNumber: 'IKX2024004', firstName: 'Ann', lastName: 'Chebet', gender: 'Female', nationality: 'Kenyan', dateOfBirth: '2008-01-08', streamId: 2, streamName: 'Form 1B', admissionDate: '2024-01-08', parentName: 'David Chebet', parentPhone: '0788990011', parentEmail: 'david.c@email.com', status: 'Inactive', profileImage: null },
];

export const assessments = [
  { id: 1, title: 'Term 1 CAT 1', type: 'CAT', subjectId: 1, subjectName: 'Mathematics', streamId: 1, streamName: 'Form 1A', maxScore: 30, date: '2024-03-15', term: 'Term 1' },
  { id: 2, title: 'Term 1 Assignment', type: 'Assignment', subjectId: 2, subjectName: 'English', streamId: 1, streamName: 'Form 1A', maxScore: 20, date: '2024-03-20', term: 'Term 1' },
  { id: 3, title: 'Midterm Exam', type: 'Midterm', subjectId: 1, subjectName: 'Mathematics', streamId: 3, streamName: 'Form 2A', maxScore: 50, date: '2024-04-10', term: 'Term 1' },
  { id: 4, title: 'End Term Exam', type: 'End Term Exam', subjectId: 3, subjectName: 'Kiswahili', streamId: 1, streamName: 'Form 1A', maxScore: 100, date: '2024-05-15', term: 'Term 1' },
  { id: 5, title: 'Term 1 CAT 2', type: 'CAT', subjectId: 6, subjectName: 'Biology', streamId: 5, streamName: 'Form 3A', maxScore: 30, date: '2024-03-25', term: 'Term 1' },
];

export const scores = [
  { id: 1, assessmentId: 1, studentId: 1, score: 25 },
  { id: 2, assessmentId: 1, studentId: 2, score: 28 },
  { id: 3, assessmentId: 2, studentId: 1, score: 18 },
  { id: 4, assessmentId: 2, studentId: 2, score: 16 },
  { id: 5, assessmentId: 3, studentId: 4, score: 42 },
  { id: 6, assessmentId: 3, studentId: 5, score: 38 },
  { id: 7, assessmentId: 4, studentId: 1, score: 78 },
  { id: 8, assessmentId: 4, studentId: 2, score: 85 },
  { id: 9, assessmentId: 5, studentId: 6, score: 27 },
];

export const recentActivities = [
  { id: 1, action: 'New student registered', detail: 'Ann Chebet (IKX2024004)', time: '2 hours ago', type: 'student' },
  { id: 2, action: 'Scores entered', detail: 'Mathematics CAT 1 - Form 1A', time: '5 hours ago', type: 'assessment' },
  { id: 3, action: 'Assessment created', detail: 'Biology CAT 2 - Form 3A', time: '1 day ago', type: 'assessment' },
  { id: 4, action: 'Report generated', detail: 'Form 2A Term 1 Reports', time: '2 days ago', type: 'report' },
  { id: 5, action: 'Stream updated', detail: 'Form 1B capacity increased', time: '3 days ago', type: 'stream' },
];

export const performanceTrends = [
  { term: 'Term 1', average: 62 },
  { term: 'Term 2', average: 65 },
  { term: 'Term 3', average: 68 },
  { term: 'Term 1', average: 71 },
];

export const subjectPerformance = [
  { subject: 'Mathematics', average: 72 },
  { subject: 'English', average: 68 },
  { subject: 'Kiswahili', average: 75 },
  { subject: 'Biology', average: 70 },
  { subject: 'Physics', average: 65 },
  { subject: 'Chemistry', average: 63 },
];

export const streamDistribution = [
  { name: 'Form 1A', students: 38 },
  { name: 'Form 1B', students: 35 },
  { name: 'Form 2A', students: 36 },
  { name: 'Form 2B', students: 34 },
  { name: 'Form 3A', students: 32 },
  { name: 'Form 4A', students: 30 },
];

export const gradeDistribution = [
  { grade: 'A', count: 45 },
  { grade: 'B', count: 78 },
  { grade: 'C', count: 92 },
  { grade: 'D', count: 35 },
  { grade: 'E', count: 15 },
];

export const adminUser = {
  id: 1,
  email: 'admin@ikonex.ac.ke',
  password: 'admin123',
  name: 'System Administrator',
  role: 'admin',
};

export const studentPortalUser = {
  id: 1,
  admissionNumber: 'IKX2024001',
  password: 'student123',
  role: 'student',
  studentId: 1,
};

export const dashboardStats = {
  totalStudents: students.filter((s) => s.status === 'Active').length,
  totalSubjects: subjects.length,
  totalStreams: classStreams.length,
  totalAssessments: assessments.length,
  averagePerformance: 68.5,
};

export const studentResults = [
  { studentId: 1, subjectId: 1, subjectName: 'Mathematics', cat: 25, exam: 78, total: 103, grade: 'A', maxTotal: 130 },
  { studentId: 1, subjectId: 2, subjectName: 'English', cat: 18, exam: 72, total: 90, grade: 'B', maxTotal: 120 },
  { studentId: 1, subjectId: 3, subjectName: 'Kiswahili', cat: 22, exam: 80, total: 102, grade: 'A', maxTotal: 130 },
  { studentId: 1, subjectId: 6, subjectName: 'Biology', cat: 20, exam: 65, total: 85, grade: 'B', maxTotal: 130 },
  { studentId: 2, subjectId: 1, subjectName: 'Mathematics', cat: 28, exam: 85, total: 113, grade: 'A', maxTotal: 130 },
  { studentId: 2, subjectId: 2, subjectName: 'English', cat: 16, exam: 70, total: 86, grade: 'B', maxTotal: 120 },
];

export const rankings = [
  { position: 1, studentId: 2, admissionNumber: 'IKX2024002', name: 'Sarah Mwangi', stream: 'Form 1A', average: 82.5, totalMarks: 412 },
  { position: 2, studentId: 1, admissionNumber: 'IKX2024001', name: 'Brian Otieno', stream: 'Form 1A', average: 78.3, totalMarks: 380 },
  { position: 3, studentId: 4, admissionNumber: 'IKX2023010', name: 'Grace Njeri', stream: 'Form 2A', average: 75.0, totalMarks: 375 },
  { position: 4, studentId: 5, admissionNumber: 'IKX2023011', name: 'Daniel Mutiso', stream: 'Form 2A', average: 71.2, totalMarks: 356 },
  { position: 5, studentId: 6, admissionNumber: 'IKX2023012', name: 'Faith Wambui', stream: 'Form 3A', average: 69.8, totalMarks: 349 },
];

export const attendanceRecords = [
  { id: 1, studentId: 1, streamId: 1, date: '2024-06-03', status: 'Present' },
  { id: 2, studentId: 2, streamId: 1, date: '2024-06-03', status: 'Present' },
  { id: 3, studentId: 1, streamId: 1, date: '2024-06-04', status: 'Present' },
  { id: 4, studentId: 2, streamId: 1, date: '2024-06-04', status: 'Absent' },
  { id: 5, studentId: 3, streamId: 2, date: '2024-06-03', status: 'Present' },
  { id: 6, studentId: 4, streamId: 3, date: '2024-06-03', status: 'Late' },
];

export const notifications = [
  { id: 1, title: 'Term 1 Results Published', message: 'Term 1 examination results are now available on the portal.', type: 'info', audience: 'all', read: false, createdAt: '2024-06-05T09:00:00' },
  { id: 2, title: 'Parent-Teacher Meeting', message: 'Scheduled for 15th June. All parents are invited.', type: 'warning', audience: 'student', read: false, createdAt: '2024-06-04T14:30:00' },
  { id: 3, title: 'New Assessment Created', message: 'Mathematics CAT 1 has been scheduled for Form 1A.', type: 'info', audience: 'admin', read: true, createdAt: '2024-06-03T11:00:00' },
  { id: 4, title: 'Attendance Alert', message: '3 students marked absent in Form 1A today.', type: 'danger', audience: 'admin', read: false, createdAt: '2024-06-06T08:15:00' },
  { id: 5, title: 'Report Cards Ready', message: 'Your Term 1 report card is ready for download.', type: 'success', audience: 'student', read: false, createdAt: '2024-06-02T16:00:00', studentId: 1 },
];

export const schoolSettings = {
  schoolName: 'Ikonex Academy',
  motto: 'Excellence in Education',
  address: 'P.O. Box 12345, Nairobi, Kenya',
  phone: '+254 700 123 456',
  email: 'info@ikonex.ac.ke',
  academicYear: '2024',
  currentTerm: 'Term 1',
  gradingSystem: 'A-E',
};

export const timetables = {
  1: [
    { day: 'Monday', slots: [{ time: '08:00', subject: 'Mathematics', teacher: 'Mr. James Ochieng', room: 'Lab 1' }, { time: '09:30', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12' }, { time: '11:00', subject: 'Biology', teacher: 'Mr. James Ochieng', room: 'Lab 2' }] },
    { day: 'Tuesday', slots: [{ time: '08:00', subject: 'Kiswahili', teacher: 'Mr. Peter Kamau', room: 'Room 8' }, { time: '09:30', subject: 'Geography', teacher: 'Mr. Peter Kamau', room: 'Room 15' }, { time: '11:00', subject: 'Mathematics', teacher: 'Mr. James Ochieng', room: 'Lab 1' }] },
    { day: 'Wednesday', slots: [{ time: '08:00', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12' }, { time: '09:30', subject: 'History', teacher: 'Mrs. Grace Wanjiku', room: 'Room 10' }, { time: '11:00', subject: 'Kiswahili', teacher: 'Mr. Peter Kamau', room: 'Room 8' }] },
    { day: 'Thursday', slots: [{ time: '08:00', subject: 'Biology', teacher: 'Mr. James Ochieng', room: 'Lab 2' }, { time: '09:30', subject: 'Mathematics', teacher: 'Mr. James Ochieng', room: 'Lab 1' }, { time: '11:00', subject: 'Geography', teacher: 'Mr. Peter Kamau', room: 'Room 15' }] },
    { day: 'Friday', slots: [{ time: '08:00', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12' }, { time: '09:30', subject: 'Mathematics', teacher: 'Mr. James Ochieng', room: 'Lab 1' }, { time: '11:00', subject: 'Games', teacher: '—', room: 'Field' }] },
  ],
};

export const feeRecords = [
  { id: 1, studentId: 1, term: 'Term 1', description: 'Tuition Fee', amount: 45000, paid: 45000, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-10' },
  { id: 2, studentId: 1, term: 'Term 1', description: 'Activity Fee', amount: 5000, paid: 5000, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-10' },
  { id: 3, studentId: 1, term: 'Term 2', description: 'Tuition Fee', amount: 45000, paid: 20000, status: 'Partial', dueDate: '2024-05-01', paidDate: '2024-04-28' },
  { id: 4, studentId: 1, term: 'Term 2', description: 'Activity Fee', amount: 5000, paid: 0, status: 'Pending', dueDate: '2024-05-01', paidDate: null },
  { id: 5, studentId: 2, term: 'Term 1', description: 'Tuition Fee', amount: 45000, paid: 45000, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-12' },
];

export const schoolEvents = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2026-06-15', time: '09:00', location: 'Main Hall', type: 'meeting' },
  { id: 2, title: 'Midterm Exams Begin', date: '2026-06-20', time: '08:00', location: 'All Classrooms', type: 'exam' },
  { id: 3, title: 'Sports Day', date: '2026-06-28', time: '08:00', location: 'School Field', type: 'sports' },
  { id: 4, title: 'Science Fair', date: '2026-07-05', time: '10:00', location: 'Science Block', type: 'event' },
  { id: 5, title: 'End of Term', date: '2026-07-26', time: '12:00', location: '—', type: 'holiday' },
  { id: 6, title: 'Mathematics Olympiad', date: '2026-06-08', time: '14:00', location: 'Lab 1', type: 'exam' },
  { id: 7, title: 'Drama Club Showcase', date: '2026-06-12', time: '16:00', location: 'Auditorium', type: 'event' },
  { id: 8, title: 'Staff Development Day', date: '2026-05-30', time: '08:00', location: '—', type: 'holiday' },
];

export const studentPerformanceHistory = {
  1: [
    { term: 'Term 1 2023', score: 65 },
    { term: 'Term 2 2023', score: 68 },
    { term: 'Term 3 2023', score: 72 },
    { term: 'Term 1 2024', score: 78 },
  ],
  2: [
    { term: 'Term 1 2023', score: 70 },
    { term: 'Term 2 2023', score: 75 },
    { term: 'Term 3 2023', score: 78 },
    { term: 'Term 1 2024', score: 82 },
  ],
};

export const studentAssessmentDetails = [
  { studentId: 1, assessmentId: 1, title: 'Term 1 CAT 1', type: 'CAT', subjectName: 'Mathematics', score: 25, maxScore: 30, date: '2024-03-15', status: 'Graded' },
  { studentId: 1, assessmentId: 2, title: 'Term 1 Assignment', type: 'Assignment', subjectName: 'English', score: 18, maxScore: 20, date: '2024-03-20', status: 'Graded' },
  { studentId: 1, assessmentId: 4, title: 'End Term Exam', type: 'End Term Exam', subjectName: 'Kiswahili', score: 78, maxScore: 100, date: '2024-05-15', status: 'Graded' },
  { studentId: 1, assessmentId: 6, title: 'Biology CAT 2', type: 'CAT', subjectName: 'Biology', score: null, maxScore: 30, date: '2024-06-12', status: 'Upcoming' },
  { studentId: 1, assessmentId: 7, title: 'Mathematics Midterm', type: 'Midterm', subjectName: 'Mathematics', score: null, maxScore: 50, date: '2024-06-20', status: 'Upcoming' },
  { studentId: 2, assessmentId: 1, title: 'Term 1 CAT 1', type: 'CAT', subjectName: 'Mathematics', score: 28, maxScore: 30, date: '2024-03-15', status: 'Graded' },
];

export function paginate(items, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
