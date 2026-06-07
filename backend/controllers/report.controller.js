const { prisma } = require('../config/db');
const { formatActivityLog } = require('../utils/formatters');
const { computeGrade } = require('../utils/grading');
const {
    getStudentResults,
    getSubjectResults,
    computeRankings,
} = require('../services/results.service');

const getDashboardStats = async (req, res, next) => {
    try {
        const [totalStudents, totalSubjects, totalStreams, totalAssessments, scores] =
            await Promise.all([
                prisma.student.count({ where: { status: 'Active' } }),
                prisma.subject.count(),
                prisma.classStream.count(),
                prisma.assessment.count(),
                prisma.score.findMany({ include: { assessment: true } }),
            ]);

        let averagePerformance = 0;
        if (scores.length) {
            const totalPct = scores.reduce(
                (sum, s) => sum + (s.score / s.assessment.maxScore) * 100,
                0,
            );
            averagePerformance = parseFloat((totalPct / scores.length).toFixed(1));
        }

        res.status(200).json({
            totalStudents,
            totalSubjects,
            totalStreams,
            totalAssessments,
            averagePerformance,
        });
    } catch (error) {
        next(error);
    }
};

const getRecentActivities = async (req, res, next) => {
    try {
        const activities = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        res.status(200).json(activities.map(formatActivityLog));
    } catch (error) {
        next(error);
    }
};

const getPerformanceTrends = async (req, res, next) => {
    try {
        const assessments = await prisma.assessment.findMany({
            include: { scores: true },
        });

        const byTerm = {};
        for (const a of assessments) {
            if (!byTerm[a.term]) byTerm[a.term] = { total: 0, count: 0 };
            for (const s of a.scores) {
                byTerm[a.term].total += (s.score / a.maxScore) * 100;
                byTerm[a.term].count += 1;
            }
        }

        const trends = Object.entries(byTerm).map(([term, { total, count }]) => ({
            term,
            average: count ? Math.round(total / count) : 0,
        }));

        res.status(200).json(trends);
    } catch (error) {
        next(error);
    }
};

const getSubjectPerformance = async (req, res, next) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                assessments: { include: { scores: true } },
            },
        });

        const performance = subjects.map((subject) => {
            let total = 0;
            let count = 0;
            for (const a of subject.assessments) {
                for (const s of a.scores) {
                    total += (s.score / a.maxScore) * 100;
                    count += 1;
                }
            }
            return {
                subject: subject.name,
                average: count ? Math.round(total / count) : 0,
            };
        });

        res.status(200).json(performance);
    } catch (error) {
        next(error);
    }
};

const getStreamDistribution = async (req, res, next) => {
    try {
        const streams = await prisma.classStream.findMany({
            include: {
                _count: { select: { students: { where: { status: 'Active' } } } },
            },
        });

        res.status(200).json(
            streams.map((s) => ({ name: s.name, students: s._count.students })),
        );
    } catch (error) {
        next(error);
    }
};

const getGradeDistribution = async (req, res, next) => {
    try {
        const students = await prisma.student.findMany({
            where: { status: 'Active' },
            select: { id: true },
        });

        const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

        for (const student of students) {
            const results = await getStudentResults(student.id);
            if (!results.length) continue;
            const total = results.reduce((sum, r) => sum + r.total, 0);
            const maxTotal = results.reduce((sum, r) => sum + r.maxTotal, 0);
            const avg = maxTotal ? (total / maxTotal) * 100 : 0;
            const grade = computeGrade(avg);
            gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        }

        res.status(200).json(
            Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count })),
        );
    } catch (error) {
        next(error);
    }
};

const getStudentResultsHandler = async (req, res, next) => {
    try {
        const results = await getStudentResults(parseInt(req.params.id, 10));
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
};

const getClassResults = async (req, res, next) => {
    try {
        const streamId = parseInt(req.params.id, 10);
        const students = await prisma.student.findMany({
            where: { streamId, status: 'Active' },
        });

        const classResults = [];
        for (const student of students) {
            const results = await getStudentResults(student.id);
            const total = results.reduce((sum, r) => sum + r.total, 0);
            const average = results.length ? total / results.length : 0;
            classResults.push({
                studentId: student.id,
                name: `${student.firstName} ${student.lastName}`,
                admissionNumber: student.admissionNumber,
                total,
                average: average.toFixed(1),
                subjects: results.length,
            });
        }

        res.status(200).json(classResults);
    } catch (error) {
        next(error);
    }
};

const getSubjectResultsHandler = async (req, res, next) => {
    try {
        const results = await getSubjectResults(parseInt(req.params.id, 10));
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
};

const getRankings = async (req, res, next) => {
    try {
        const rankings = await computeRankings({ streamId: req.query.streamId });
        res.status(200).json(rankings);
    } catch (error) {
        next(error);
    }
};

const getReportCard = async (req, res, next) => {
    try {
        const studentId = parseInt(req.params.id, 10);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { stream: true },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

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
            student: {
                ...student,
                streamName: student.stream.name,
            },
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

const getTopStudents = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;
        const rankings = await computeRankings();
        res.status(200).json(rankings.slice(0, limit));
    } catch (error) {
        next(error);
    }
};

const getBottomStudents = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;
        const rankings = await computeRankings();
        res.status(200).json([...rankings].reverse().slice(0, limit));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivities,
    getPerformanceTrends,
    getSubjectPerformance,
    getStreamDistribution,
    getGradeDistribution,
    getStudentResultsHandler,
    getClassResults,
    getSubjectResultsHandler,
    getRankings,
    getReportCard,
    getTopStudents,
    getBottomStudents,
};
