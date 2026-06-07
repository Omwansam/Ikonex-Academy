const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { formatStudent, formatSubject, formatEvent } = require('../utils/formatters');
const { computeGrade } = require('../utils/grading');
const {
    getStudentResults,
    computeRankings,
    getStudentAssessmentDetails,
} = require('../services/results.service');

function getStudentId(req) {
    return req.user.studentId;
}

const getDashboard = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const [results, rankings, attendanceRecords, notifications, settings, fees] =
            await Promise.all([
                getStudentResults(studentId),
                computeRankings({ streamId: student.streamId }),
                prisma.attendanceRecord.findMany({ where: { studentId } }),
                prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }),
                prisma.schoolSettings.findUnique({ where: { id: 1 } }),
                prisma.feeRecord.findMany({ where: { studentId } }),
            ]);

        const ranking = rankings.find((r) => r.studentId === studentId);
        const present = attendanceRecords.filter((r) => r.status === 'Present').length;
        const totalAttendance = attendanceRecords.length || 1;
        const balance = fees.reduce((sum, f) => sum + (f.amount - f.paid), 0);

        const total = results.reduce((s, r) => s + r.total, 0);
        const maxTotal = results.reduce((s, r) => s + r.maxTotal, 0);
        const average = maxTotal ? ((total / maxTotal) * 100).toFixed(1) : 0;

        const assessments = await getStudentAssessmentDetails(studentId);
        const upcoming = assessments.filter((a) => a.status === 'Upcoming').slice(0, 3);

        const studentNotifications = notifications
            .filter(
                (n) =>
                    n.audience === 'all' ||
                    (n.audience === 'student' && (!n.studentId || n.studentId === studentId)),
            )
            .slice(0, 4);

        const events = await prisma.schoolEvent.findMany({
            orderBy: { date: 'asc' },
            take: 3,
        });

        res.status(200).json({
            student: formatStudent(student),
            stream: student.stream,
            stats: {
                className: student.stream.name,
                average,
                position: ranking?.position || '—',
                subjectsCount: results.length,
                attendanceRate: Math.round((present / totalAttendance) * 100),
                feeBalance: balance,
            },
            results,
            ranking,
            attendance: {
                present,
                absent: attendanceRecords.filter((r) => r.status === 'Absent').length,
                late: attendanceRecords.filter((r) => r.status === 'Late').length,
                total: attendanceRecords.length,
                rate: Math.round((present / totalAttendance) * 100),
                records: attendanceRecords.slice(0, 10),
            },
            notifications: studentNotifications,
            upcomingAssessments: upcoming,
            performanceTrend: [],
            recentEvents: events.map(formatEvent),
            term: settings?.currentTerm || 'Term 1',
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });
        const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });

        res.status(200).json({
            student: formatStudent(student),
            stream: student.stream,
            settings,
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const allowed = ['parentPhone', 'parentEmail', 'parentName'];
        const data = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        const student = await prisma.student.update({
            where: { id: studentId },
            data,
            include: { stream: true },
        });

        res.status(200).json(formatStudent(student));
    } catch (error) {
        next(error);
    }
};

const getSubjects = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({ where: { id: studentId } });
        const results = await getStudentResults(studentId);

        const subjectStreams = await prisma.subjectStream.findMany({
            where: { streamId: student.streamId },
            include: { subject: { include: { teacher: true, streams: true } } },
        });

        const subjects = subjectStreams.map(({ subject }) => {
            const formatted = formatSubject(subject);
            const result = results.find((r) => r.subjectId === subject.id);
            return {
                ...formatted,
                grade: result?.grade || '—',
                total: result?.total ?? null,
                maxTotal: result?.maxTotal ?? null,
                cat: result?.cat ?? null,
                exam: result?.exam ?? null,
            };
        });

        res.status(200).json(subjects);
    } catch (error) {
        next(error);
    }
};

const getSubjectDetail = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const subjectId = parseInt(req.params.id, 10);

        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
            include: { teacher: true, streams: true },
        });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const results = await getStudentResults(studentId);
        const result = results.find((r) => r.subjectId === subjectId);
        const assessments = await getStudentAssessmentDetails(studentId);
        const subjectAssessments = assessments.filter((a) => a.subjectName === subject.name);

        res.status(200).json({
            subject: formatSubject(subject),
            result,
            assessments: subjectAssessments,
        });
    } catch (error) {
        next(error);
    }
};

const getResults = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const term = req.query.term;
        const results = await getStudentResults(studentId, term);
        const rankings = await computeRankings();
        const ranking = rankings.find((r) => r.studentId === studentId);

        const total = results.reduce((s, r) => s + r.total, 0);
        const maxTotal = results.reduce((s, r) => s + r.maxTotal, 0);
        const average = results.length ? ((total / maxTotal) * 100).toFixed(1) : 0;
        const gradeCounts = results.reduce((acc, r) => {
            acc[r.grade] = (acc[r.grade] || 0) + 1;
            return acc;
        }, {});

        const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });

        res.status(200).json({
            results,
            summary: {
                total,
                maxTotal,
                average,
                position: ranking?.position,
                gradeCounts,
            },
            term: term || settings?.currentTerm || 'Term 1',
        });
    } catch (error) {
        next(error);
    }
};

const getAssessments = async (req, res, next) => {
    try {
        const list = await getStudentAssessmentDetails(getStudentId(req));
        res.status(200).json({
            upcoming: list.filter((a) => a.status === 'Upcoming'),
            graded: list.filter((a) => a.status === 'Graded'),
            all: list,
        });
    } catch (error) {
        next(error);
    }
};

const getTimetable = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });

        const slots = await prisma.timetableSlot.findMany({
            where: { streamId: student.streamId },
            orderBy: [{ day: 'asc' }, { sortOrder: 'asc' }],
        });

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const schedule = days
            .map((day) => ({
                day,
                slots: slots
                    .filter((s) => s.day === day)
                    .map(({ time, subject, teacher, room }) => ({ time, subject, teacher, room })),
            }))
            .filter((d) => d.slots.length);

        const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            new Date().getDay()
        ];
        const today = schedule.find((d) => d.day === todayName) || schedule[0];

        res.status(200).json({
            schedule,
            today,
            streamName: student.stream.name,
        });
    } catch (error) {
        next(error);
    }
};

const getRankings = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });

        const allRankings = await computeRankings();
        const classRankings = await computeRankings({ streamId: student.streamId });
        const myRank =
            classRankings.find((r) => r.studentId === studentId) ||
            allRankings.find((r) => r.studentId === studentId);

        res.status(200).json({
            classRankings,
            myRank,
            overallRankings: allRankings.slice(0, 10),
        });
    } catch (error) {
        next(error);
    }
};

const getFees = async (req, res, next) => {
    try {
        const fees = await prisma.feeRecord.findMany({
            where: { studentId: getStudentId(req) },
            orderBy: { dueDate: 'desc' },
        });

        const totalDue = fees.reduce((s, f) => s + f.amount, 0);
        const totalPaid = fees.reduce((s, f) => s + f.paid, 0);

        res.status(200).json({
            fees,
            summary: { totalDue, totalPaid, balance: totalDue - totalPaid },
        });
    } catch (error) {
        next(error);
    }
};

const getEvents = async (req, res, next) => {
    try {
        const events = await prisma.schoolEvent.findMany({ orderBy: { date: 'asc' } });
        res.status(200).json(events.map(formatEvent));
    } catch (error) {
        next(error);
    }
};

const getReportCard = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });

        const results = await getStudentResults(studentId);
        const rankings = await computeRankings({ streamId: student.streamId });
        const ranking = rankings.find((r) => r.studentId === studentId);

        const totalMarks = results.reduce((sum, r) => sum + r.total, 0);
        const maxTotal = results.reduce((sum, r) => sum + r.maxTotal, 0);
        const average = maxTotal
            ? parseFloat(((totalMarks / maxTotal) * 100).toFixed(1))
            : 0;

        const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });
        const term = settings?.currentTerm || 'Term 1';
        const comment = await prisma.reportComment.findUnique({
            where: { studentId_term: { studentId, term } },
        });

        res.status(200).json({
            student: formatStudent(student),
            results,
            summary: {
                totalMarks,
                average,
                position: ranking?.position || '—',
                grade: computeGrade(average),
            },
            teacherComment:
                comment?.comment || 'Shows great improvement. Keep up the good work.',
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const student = await prisma.student.findUnique({
            where: { id: getStudentId(req) },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.student.update({
            where: { id: student.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getProfile,
    updateProfile,
    getSubjects,
    getSubjectDetail,
    getResults,
    getAssessments,
    getTimetable,
    getRankings,
    getFees,
    getEvents,
    getReportCard,
    changePassword,
};
