require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ADMIN_PASSWORD = 'admin123';
const STUDENT_PASSWORD = 'student123';

async function clearDatabase() {
    await prisma.score.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.subjectStream.deleteMany();
    await prisma.attendanceRecord.deleteMany();
    await prisma.feeRecord.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.reportComment.deleteMany();
    await prisma.timetableSlot.deleteMany();
    await prisma.schoolEvent.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.student.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.classStream.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
    await prisma.schoolSettings.deleteMany();
}

async function main() {
    console.log('Seeding database...');

    await clearDatabase();

    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.user.create({
        data: {
            email: 'admin@ikonex.ac.ke',
            password: adminHash,
            name: 'System Administrator',
            role: 'admin',
        },
    });

    const teachers = await Promise.all(
        [
            { name: 'Mr. James Ochieng', email: 'j.ochieng@ikonex.ac.ke', phone: '0712345678', subject: 'Mathematics' },
            { name: 'Mrs. Grace Wanjiku', email: 'g.wanjiku@ikonex.ac.ke', phone: '0723456789', subject: 'English' },
            { name: 'Mr. Peter Kamau', email: 'p.kamau@ikonex.ac.ke', phone: '0734567890', subject: 'Kiswahili' },
            { name: 'Ms. Faith Akinyi', email: 'f.akinyi@ikonex.ac.ke', phone: '0745678901', subject: 'Physics' },
            { name: 'Mr. David Mutua', email: 'd.mutua@ikonex.ac.ke', phone: '0756789012', subject: 'Chemistry' },
        ].map((t) => prisma.teacher.create({ data: t })),
    );

    const streams = await Promise.all(
        [
            { name: 'Form 1A', classLevel: 'Form 1', capacity: 40, classTeacherId: teachers[0].id },
            { name: 'Form 1B', classLevel: 'Form 1', capacity: 40, classTeacherId: teachers[1].id },
            { name: 'Form 2A', classLevel: 'Form 2', capacity: 40, classTeacherId: teachers[2].id },
            { name: 'Form 2B', classLevel: 'Form 2', capacity: 40, classTeacherId: teachers[3].id },
            { name: 'Form 3A', classLevel: 'Form 3', capacity: 35, classTeacherId: teachers[4].id },
            { name: 'Form 4A', classLevel: 'Form 4', capacity: 35, classTeacherId: teachers[0].id },
        ].map((s) => prisma.classStream.create({ data: s })),
    );

    const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);
    const studentData = [
        { admissionNumber: 'IKX2024001', firstName: 'Brian', lastName: 'Otieno', gender: 'Male', dateOfBirth: '2008-03-15', streamId: streams[0].id, admissionDate: '2024-01-08', parentName: 'Mary Otieno', parentPhone: '0711223344', parentEmail: 'mary.otieno@email.com', status: 'Active' },
        { admissionNumber: 'IKX2024002', firstName: 'Sarah', lastName: 'Mwangi', gender: 'Female', dateOfBirth: '2008-07-22', streamId: streams[0].id, admissionDate: '2024-01-08', parentName: 'John Mwangi', parentPhone: '0722334455', parentEmail: 'john.mwangi@email.com', status: 'Active' },
        { admissionNumber: 'IKX2024003', firstName: 'Kevin', lastName: 'Kipchoge', gender: 'Male', dateOfBirth: '2007-11-05', streamId: streams[1].id, admissionDate: '2024-01-08', parentName: 'Jane Kipchoge', parentPhone: '0733445566', parentEmail: 'jane.kip@email.com', status: 'Active' },
        { admissionNumber: 'IKX2023010', firstName: 'Grace', lastName: 'Njeri', gender: 'Female', dateOfBirth: '2007-05-18', streamId: streams[2].id, admissionDate: '2023-01-09', parentName: 'Peter Njeri', parentPhone: '0744556677', parentEmail: 'peter.njeri@email.com', status: 'Active' },
        { admissionNumber: 'IKX2023011', firstName: 'Daniel', lastName: 'Mutiso', gender: 'Male', dateOfBirth: '2007-09-30', streamId: streams[2].id, admissionDate: '2023-01-09', parentName: 'Lucy Mutiso', parentPhone: '0755667788', parentEmail: 'lucy.m@email.com', status: 'Active' },
        { admissionNumber: 'IKX2023012', firstName: 'Faith', lastName: 'Wambui', gender: 'Female', dateOfBirth: '2006-12-12', streamId: streams[4].id, admissionDate: '2022-01-10', parentName: 'Samuel Wambui', parentPhone: '0766778899', parentEmail: 'sam.w@email.com', status: 'Active' },
        { admissionNumber: 'IKX2022005', firstName: 'Michael', lastName: 'Omondi', gender: 'Male', dateOfBirth: '2006-04-25', streamId: streams[5].id, admissionDate: '2021-01-11', parentName: 'Rose Omondi', parentPhone: '0777889900', parentEmail: 'rose.o@email.com', status: 'Active' },
        { admissionNumber: 'IKX2024004', firstName: 'Ann', lastName: 'Chebet', gender: 'Female', dateOfBirth: '2008-01-08', streamId: streams[1].id, admissionDate: '2024-01-08', parentName: 'David Chebet', parentPhone: '0788990011', parentEmail: 'david.c@email.com', status: 'Inactive' },
    ];

    const students = await Promise.all(
        studentData.map((s) =>
            prisma.student.create({
                data: {
                    ...s,
                    password: studentHash,
                    nationality: 'Kenyan',
                    dateOfBirth: new Date(s.dateOfBirth),
                    admissionDate: new Date(s.admissionDate),
                },
            }),
        ),
    );

    const subjectDefs = [
        { code: 'MATH', name: 'Mathematics', description: 'Core mathematics curriculum', teacherId: teachers[0].id, streamIds: [0, 1, 2, 3, 4, 5] },
        { code: 'ENG', name: 'English', description: 'Language and literature', teacherId: teachers[1].id, streamIds: [0, 1, 2, 3, 4, 5] },
        { code: 'KIS', name: 'Kiswahili', description: 'National language studies', teacherId: teachers[2].id, streamIds: [0, 1, 2, 3, 4, 5] },
        { code: 'PHY', name: 'Physics', description: 'Physical sciences', teacherId: teachers[3].id, streamIds: [2, 3, 4, 5] },
        { code: 'CHEM', name: 'Chemistry', description: 'Chemical sciences', teacherId: teachers[4].id, streamIds: [2, 3, 4, 5] },
        { code: 'BIO', name: 'Biology', description: 'Life sciences', teacherId: teachers[0].id, streamIds: [0, 1, 2, 3, 4, 5] },
        { code: 'HIST', name: 'History', description: 'Historical studies', teacherId: teachers[1].id, streamIds: [0, 1, 2, 3] },
        { code: 'GEO', name: 'Geography', description: 'Earth and environment', teacherId: teachers[2].id, streamIds: [0, 1, 2, 3, 4, 5] },
    ];

    const subjects = [];
    for (const def of subjectDefs) {
        const { streamIds, ...data } = def;
        const subject = await prisma.subject.create({
            data: {
                ...data,
                streams: {
                    create: streamIds.map((idx) => ({ streamId: streams[idx].id })),
                },
            },
        });
        subjects.push(subject);
    }

    const assessments = await Promise.all(
        [
            { title: 'Term 1 CAT 1', type: 'CAT', subjectId: subjects[0].id, streamId: streams[0].id, maxScore: 30, date: '2024-03-15', term: 'Term 1' },
            { title: 'Term 1 Assignment', type: 'Assignment', subjectId: subjects[1].id, streamId: streams[0].id, maxScore: 20, date: '2024-03-20', term: 'Term 1' },
            { title: 'Midterm Exam', type: 'Midterm', subjectId: subjects[0].id, streamId: streams[2].id, maxScore: 50, date: '2024-04-10', term: 'Term 1' },
            { title: 'End Term Exam', type: 'End Term Exam', subjectId: subjects[2].id, streamId: streams[0].id, maxScore: 100, date: '2024-05-15', term: 'Term 1' },
            { title: 'Term 1 CAT 2', type: 'CAT', subjectId: subjects[5].id, streamId: streams[4].id, maxScore: 30, date: '2024-03-25', term: 'Term 1' },
        ].map((a) =>
            prisma.assessment.create({
                data: { ...a, date: new Date(a.date) },
            }),
        ),
    );

    await prisma.score.createMany({
        data: [
            { assessmentId: assessments[0].id, studentId: students[0].id, score: 25 },
            { assessmentId: assessments[0].id, studentId: students[1].id, score: 28 },
            { assessmentId: assessments[1].id, studentId: students[0].id, score: 18 },
            { assessmentId: assessments[1].id, studentId: students[1].id, score: 16 },
            { assessmentId: assessments[2].id, studentId: students[3].id, score: 42 },
            { assessmentId: assessments[2].id, studentId: students[4].id, score: 38 },
            { assessmentId: assessments[3].id, studentId: students[0].id, score: 78 },
            { assessmentId: assessments[3].id, studentId: students[1].id, score: 85 },
            { assessmentId: assessments[4].id, studentId: students[5].id, score: 27 },
        ],
    });

    await prisma.attendanceRecord.createMany({
        data: [
            { studentId: students[0].id, streamId: streams[0].id, date: new Date('2024-06-03'), status: 'Present' },
            { studentId: students[1].id, streamId: streams[0].id, date: new Date('2024-06-03'), status: 'Present' },
            { studentId: students[0].id, streamId: streams[0].id, date: new Date('2024-06-04'), status: 'Present' },
            { studentId: students[1].id, streamId: streams[0].id, date: new Date('2024-06-04'), status: 'Absent' },
            { studentId: students[2].id, streamId: streams[1].id, date: new Date('2024-06-03'), status: 'Present' },
            { studentId: students[3].id, streamId: streams[2].id, date: new Date('2024-06-03'), status: 'Late' },
        ],
    });

    await prisma.feeRecord.createMany({
        data: [
            { studentId: students[0].id, term: 'Term 1', description: 'Tuition Fee', amount: 45000, paid: 45000, status: 'Paid', dueDate: new Date('2024-01-15'), paidDate: new Date('2024-01-10') },
            { studentId: students[0].id, term: 'Term 1', description: 'Activity Fee', amount: 5000, paid: 5000, status: 'Paid', dueDate: new Date('2024-01-15'), paidDate: new Date('2024-01-10') },
            { studentId: students[0].id, term: 'Term 2', description: 'Tuition Fee', amount: 45000, paid: 20000, status: 'Partial', dueDate: new Date('2024-05-01'), paidDate: new Date('2024-04-28') },
            { studentId: students[0].id, term: 'Term 2', description: 'Activity Fee', amount: 5000, paid: 0, status: 'Pending', dueDate: new Date('2024-05-01') },
            { studentId: students[1].id, term: 'Term 1', description: 'Tuition Fee', amount: 45000, paid: 45000, status: 'Paid', dueDate: new Date('2024-01-15'), paidDate: new Date('2024-01-12') },
        ],
    });

    await prisma.notification.createMany({
        data: [
            { title: 'Term 1 Results Published', message: 'Term 1 examination results are now available on the portal.', type: 'info', audience: 'all', read: false, createdAt: new Date('2024-06-05T09:00:00') },
            { title: 'Parent-Teacher Meeting', message: 'Scheduled for 15th June. All parents are invited.', type: 'warning', audience: 'student', read: false, createdAt: new Date('2024-06-04T14:30:00') },
            { title: 'New Assessment Created', message: 'Mathematics CAT 1 has been scheduled for Form 1A.', type: 'info', audience: 'admin', read: true, createdAt: new Date('2024-06-03T11:00:00') },
            { title: 'Attendance Alert', message: '3 students marked absent in Form 1A today.', type: 'danger', audience: 'admin', read: false, createdAt: new Date('2024-06-06T08:15:00') },
            { title: 'Report Cards Ready', message: 'Your Term 1 report card is ready for download.', type: 'success', audience: 'student', read: false, createdAt: new Date('2024-06-02T16:00:00'), studentId: students[0].id },
        ],
    });

    await prisma.schoolSettings.create({
        data: {
            id: 1,
            schoolName: 'Ikonex Academy',
            motto: 'Excellence in Education',
            address: 'P.O. Box 12345, Nairobi, Kenya',
            phone: '+254 700 123 456',
            email: 'info@ikonex.ac.ke',
            academicYear: '2024',
            currentTerm: 'Term 1',
            gradingSystem: 'A-E',
        },
    });

    await prisma.schoolEvent.createMany({
        data: [
            { title: 'Parent-Teacher Meeting', date: new Date('2026-06-15'), time: '09:00', location: 'Main Hall', type: 'meeting' },
            { title: 'Midterm Exams Begin', date: new Date('2026-06-20'), time: '08:00', location: 'All Classrooms', type: 'exam' },
            { title: 'Sports Day', date: new Date('2026-06-28'), time: '08:00', location: 'School Field', type: 'sports' },
            { title: 'Science Fair', date: new Date('2026-07-05'), time: '10:00', location: 'Science Block', type: 'event' },
            { title: 'End of Term', date: new Date('2026-07-26'), time: '12:00', location: '—', type: 'holiday' },
        ],
    });

    const timetableData = [
        { day: 'Monday', time: '08:00', subject: 'Mathematics', teacher: 'Mr. James Ochieng', room: 'Lab 1', sortOrder: 0 },
        { day: 'Monday', time: '09:30', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12', sortOrder: 1 },
        { day: 'Monday', time: '11:00', subject: 'Biology', teacher: 'Mr. James Ochieng', room: 'Lab 2', sortOrder: 2 },
        { day: 'Tuesday', time: '08:00', subject: 'Kiswahili', teacher: 'Mr. Peter Kamau', room: 'Room 8', sortOrder: 0 },
        { day: 'Tuesday', time: '09:30', subject: 'Geography', teacher: 'Mr. Peter Kamau', room: 'Room 15', sortOrder: 1 },
        { day: 'Wednesday', time: '08:00', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12', sortOrder: 0 },
        { day: 'Thursday', time: '08:00', subject: 'Biology', teacher: 'Mr. James Ochieng', room: 'Lab 2', sortOrder: 0 },
        { day: 'Friday', time: '08:00', subject: 'English', teacher: 'Mrs. Grace Wanjiku', room: 'Room 12', sortOrder: 0 },
    ];

    await prisma.timetableSlot.createMany({
        data: timetableData.map((slot) => ({ ...slot, streamId: streams[0].id })),
    });

    await prisma.activityLog.createMany({
        data: [
            { action: 'New student registered', detail: 'Ann Chebet (IKX2024004)', type: 'student' },
            { action: 'Scores entered', detail: 'Mathematics CAT 1 - Form 1A', type: 'assessment' },
            { action: 'Assessment created', detail: 'Biology CAT 2 - Form 3A', type: 'assessment' },
            { action: 'Report generated', detail: 'Form 2A Term 1 Reports', type: 'report' },
            { action: 'Stream updated', detail: 'Form 1B capacity increased', type: 'stream' },
        ],
    });

    console.log('Seed completed.');
    console.log('Admin login: admin@ikonex.ac.ke / admin123');
    console.log('Student login: IKX2024001 / student123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
