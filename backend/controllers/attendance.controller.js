const { prisma } = require('../config/db');

const getAttendanceByStreamAndDate = async (req, res, next) => {
    try {
        const streamId = parseInt(req.query.streamId, 10);
        const date = req.query.date;

        if (!streamId || !date) {
            return res.status(400).json({ error: 'streamId and date are required' });
        }

        const dateValue = new Date(date);
        const students = await prisma.student.findMany({
            where: { streamId, status: 'Active' },
            orderBy: { firstName: 'asc' },
        });

        const records = await prisma.attendanceRecord.findMany({
            where: { streamId, date: dateValue },
        });

        const rollCall = students.map((student) => {
            const record = records.find((r) => r.studentId === student.id);
            return {
                studentId: student.id,
                admissionNumber: student.admissionNumber,
                name: `${student.firstName} ${student.lastName}`,
                status: record?.status || 'Present',
                recordId: record?.id || null,
            };
        });

        res.status(200).json(rollCall);
    } catch (error) {
        next(error);
    }
};

const VALID_ATTENDANCE_STATUSES = new Set(['Present', 'Absent', 'Late']);

const saveAttendance = async (req, res, next) => {
    try {
        const { streamId, date, records } = req.body;
        if (!streamId || !date || !Array.isArray(records)) {
            return res.status(400).json({ error: 'streamId, date and records are required' });
        }

        const dateValue = new Date(date);
        if (Number.isNaN(dateValue.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const streamIdInt = parseInt(streamId, 10);
        if (Number.isNaN(streamIdInt)) {
            return res.status(400).json({ error: 'Invalid streamId' });
        }

        for (const { status } of records) {
            if (!VALID_ATTENDANCE_STATUSES.has(status)) {
                return res.status(400).json({
                    error: `Invalid attendance status. Allowed: ${[...VALID_ATTENDANCE_STATUSES].join(', ')}`,
                });
            }
        }

        await prisma.$transaction(
            records.map(({ studentId, status }) =>
                prisma.attendanceRecord.upsert({
                    where: {
                        studentId_date: {
                            studentId: parseInt(studentId, 10),
                            date: dateValue,
                        },
                    },
                    update: { status, streamId: streamIdInt },
                    create: {
                        studentId: parseInt(studentId, 10),
                        streamId: streamIdInt,
                        date: dateValue,
                        status,
                    },
                }),
            ),
        );

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

const getStudentAttendanceSummary = async (req, res, next) => {
    try {
        const studentId = parseInt(req.params.studentId, 10);

        if (req.user.role === 'student' && req.user.studentId !== studentId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const records = await prisma.attendanceRecord.findMany({
            where: { studentId },
            orderBy: { date: 'desc' },
        });

        const present = records.filter((r) => r.status === 'Present').length;
        const absent = records.filter((r) => r.status === 'Absent').length;
        const late = records.filter((r) => r.status === 'Late').length;
        const total = records.length || 1;

        res.status(200).json({
            present,
            absent,
            late,
            total: records.length,
            rate: Math.round((present / total) * 100),
            records: records.slice(0, 10),
        });
    } catch (error) {
        next(error);
    }
};

const getStreamAttendanceStats = async (req, res, next) => {
    try {
        const streamId = parseInt(req.params.streamId, 10);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRecords = await prisma.attendanceRecord.findMany({
            where: { streamId, date: today },
        });

        res.status(200).json({
            todayPresent: todayRecords.filter((r) => r.status === 'Present').length,
            todayAbsent: todayRecords.filter((r) => r.status === 'Absent').length,
            todayLate: todayRecords.filter((r) => r.status === 'Late').length,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAttendanceByStreamAndDate,
    saveAttendance,
    getStudentAttendanceSummary,
    getStreamAttendanceStats,
};
