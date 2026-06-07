const { prisma } = require('../config/db');
const { paginate, parsePaginationQuery } = require('../utils/pagination');
const { formatSubject } = require('../utils/formatters');

const getAllSubjects = async (req, res, next) => {
    try {
        const { search } = req.query;
        const { page, pageSize } = parsePaginationQuery(req.query);

        const subjects = await prisma.subject.findMany({
            include: {
                teacher: true,
                streams: true,
            },
            orderBy: { name: 'asc' },
        });

        let formatted = subjects.map(formatSubject);

        if (search) {
            const q = search.toLowerCase();
            formatted = formatted.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.code.toLowerCase().includes(q) ||
                    (s.teacher && s.teacher.toLowerCase().includes(q)),
            );
        }

        res.status(200).json(paginate(formatted, page, pageSize));
    } catch (error) {
        next(error);
    }
};

const getSubjectById = async (req, res, next) => {
    try {
        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(req.params.id, 10) },
            include: { teacher: true, streams: true },
        });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(formatSubject(subject));
    } catch (error) {
        next(error);
    }
};

const createSubject = async (req, res, next) => {
    try {
        const { code, name, description, teacherId, streamIds = [] } = req.body;
        if (!code || !name || !teacherId) {
            return res.status(400).json({ error: 'Code, name and teacher are required' });
        }

        const subject = await prisma.subject.create({
            data: {
                code: code.trim().toUpperCase(),
                name: name.trim(),
                description: description || '',
                teacherId: parseInt(teacherId, 10),
                streams: {
                    create: streamIds.map((streamId) => ({
                        streamId: parseInt(streamId, 10),
                    })),
                },
            },
            include: { teacher: true, streams: true },
        });

        res.status(201).json(formatSubject(subject));
    } catch (error) {
        next(error);
    }
};

const updateSubject = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { streamIds, ...rest } = req.body;
        const data = { ...rest };
        delete data.id;
        delete data.teacher;
        if (data.code) data.code = data.code.trim().toUpperCase();
        if (data.teacherId) data.teacherId = parseInt(data.teacherId, 10);

        if (streamIds !== undefined) {
            await prisma.subjectStream.deleteMany({ where: { subjectId: id } });
            if (streamIds.length) {
                await prisma.subjectStream.createMany({
                    data: streamIds.map((streamId) => ({
                        subjectId: id,
                        streamId: parseInt(streamId, 10),
                    })),
                });
            }
        }

        const subject = await prisma.subject.update({
            where: { id },
            data,
            include: { teacher: true, streams: true },
        });

        res.status(200).json(formatSubject(subject));
    } catch (error) {
        next(error);
    }
};

const deleteSubject = async (req, res, next) => {
    try {
        await prisma.subject.delete({ where: { id: parseInt(req.params.id, 10) } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

const getSubjectStats = async (req, res, next) => {
    try {
        const total = await prisma.subject.count();
        res.status(200).json({ total });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectStats,
};
