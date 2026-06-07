const { prisma } = require('../config/db');
const { paginate, parsePaginationQuery } = require('../utils/pagination');
const { formatAssessment } = require('../utils/formatters');
const { logActivity } = require('../utils/activityLog');

const getAllAssessments = async (req, res, next) => {
    try {
        const { search, type, streamId } = req.query;
        const { page, pageSize } = parsePaginationQuery(req.query);

        const where = {};
        if (type) where.type = type;
        if (streamId) where.streamId = parseInt(streamId, 10);

        const assessments = await prisma.assessment.findMany({
            where,
            include: { subject: true, stream: true },
            orderBy: { date: 'desc' },
        });

        let formatted = assessments.map(formatAssessment);

        if (search) {
            const q = search.toLowerCase();
            formatted = formatted.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    (a.subjectName && a.subjectName.toLowerCase().includes(q)),
            );
        }

        res.status(200).json(paginate(formatted, page, pageSize));
    } catch (error) {
        next(error);
    }
};

const getAssessmentById = async (req, res, next) => {
    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id: parseInt(req.params.id, 10) },
            include: { subject: true, stream: true },
        });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        res.status(200).json(formatAssessment(assessment));
    } catch (error) {
        next(error);
    }
};

const createAssessment = async (req, res, next) => {
    try {
        const { title, type, subjectId, streamId, maxScore, date, term } = req.body;
        if (!title || !type || !subjectId || !streamId) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const assessment = await prisma.assessment.create({
            data: {
                title: title.trim(),
                type,
                subjectId: parseInt(subjectId, 10),
                streamId: parseInt(streamId, 10),
                maxScore: parseInt(maxScore, 10) || 100,
                date: new Date(date),
                term: term || 'Term 1',
            },
            include: { subject: true, stream: true },
        });

        await logActivity({
            action: 'Assessment created',
            detail: `${assessment.title} - ${assessment.stream.name}`,
            type: 'assessment',
        });

        res.status(201).json(formatAssessment(assessment));
    } catch (error) {
        next(error);
    }
};

const updateAssessment = async (req, res, next) => {
    try {
        const data = { ...req.body };
        delete data.id;
        delete data.subjectName;
        delete data.streamName;
        if (data.subjectId) data.subjectId = parseInt(data.subjectId, 10);
        if (data.streamId) data.streamId = parseInt(data.streamId, 10);
        if (data.maxScore) data.maxScore = parseInt(data.maxScore, 10);
        if (data.date) data.date = new Date(data.date);

        const assessment = await prisma.assessment.update({
            where: { id: parseInt(req.params.id, 10) },
            data,
            include: { subject: true, stream: true },
        });

        res.status(200).json(formatAssessment(assessment));
    } catch (error) {
        next(error);
    }
};

const deleteAssessment = async (req, res, next) => {
    try {
        await prisma.assessment.delete({ where: { id: parseInt(req.params.id, 10) } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

const getAssessmentScores = async (req, res, next) => {
    try {
        const scores = await prisma.score.findMany({
            where: { assessmentId: parseInt(req.params.id, 10) },
            include: { student: true },
        });
        res.status(200).json(scores);
    } catch (error) {
        next(error);
    }
};

const submitScore = async (req, res, next) => {
    try {
        const assessmentId = parseInt(req.params.id, 10);
        const { studentId, score } = req.body;

        if (!studentId || score === undefined) {
            return res.status(400).json({ error: 'Student ID and score are required' });
        }

        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
        });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        const scoreValue = parseInt(score, 10);
        if (scoreValue > assessment.maxScore) {
            return res.status(400).json({ error: `Score cannot exceed ${assessment.maxScore}` });
        }

        const existing = await prisma.score.findUnique({
            where: {
                assessmentId_studentId: {
                    assessmentId,
                    studentId: parseInt(studentId, 10),
                },
            },
        });
        if (existing) {
            return res.status(409).json({ error: 'Score already submitted for this student' });
        }

        const newScore = await prisma.score.create({
            data: {
                assessmentId,
                studentId: parseInt(studentId, 10),
                score: scoreValue,
            },
        });

        await logActivity({
            action: 'Scores entered',
            detail: `${assessment.title}`,
            type: 'assessment',
        });

        res.status(201).json(newScore);
    } catch (error) {
        next(error);
    }
};

const updateScore = async (req, res, next) => {
    try {
        const { score } = req.body;
        const scoreRecord = await prisma.score.findUnique({
            where: { id: parseInt(req.params.id, 10) },
            include: { assessment: true },
        });
        if (!scoreRecord) {
            return res.status(404).json({ error: 'Score not found' });
        }

        const scoreValue = parseInt(score, 10);
        if (scoreValue > scoreRecord.assessment.maxScore) {
            return res.status(400).json({
                error: `Score cannot exceed ${scoreRecord.assessment.maxScore}`,
            });
        }

        const updated = await prisma.score.update({
            where: { id: scoreRecord.id },
            data: { score: scoreValue },
        });

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAssessments,
    getAssessmentById,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentScores,
    submitScore,
    updateScore,
};
