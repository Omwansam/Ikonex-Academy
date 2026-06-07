const { prisma } = require('../config/db');
const { paginate, parsePaginationQuery } = require('../utils/pagination');
const { formatStream } = require('../utils/formatters');
const { logActivity } = require('../utils/activityLog');

const getAllStreams = async (req, res, next) => {
    try {
        const { search, classLevel } = req.query;
        const { page, pageSize } = parsePaginationQuery(req.query);

        const where = {};
        if (classLevel) where.classLevel = classLevel;

        const streams = await prisma.classStream.findMany({
            where,
            include: {
                classTeacher: true,
                _count: { select: { students: { where: { status: 'Active' } } } },
            },
            orderBy: { name: 'asc' },
        });

        let formatted = streams.map((s) => formatStream(s, s._count.students));

        if (search) {
            const q = search.toLowerCase();
            formatted = formatted.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    (s.classTeacher && s.classTeacher.toLowerCase().includes(q)),
            );
        }

        res.status(200).json(paginate(formatted, page, pageSize));
    } catch (error) {
        next(error);
    }
};

const getStreamsSimple = async (req, res, next) => {
    try {
        const streams = await prisma.classStream.findMany({
            select: { id: true, name: true, classLevel: true },
            orderBy: { name: 'asc' },
        });
        res.status(200).json(streams);
    } catch (error) {
        next(error);
    }
};

const getStreamById = async (req, res, next) => {
    try {
        const stream = await prisma.classStream.findUnique({
            where: { id: parseInt(req.params.id, 10) },
            include: {
                classTeacher: true,
                _count: { select: { students: { where: { status: 'Active' } } } },
            },
        });
        if (!stream) {
            return res.status(404).json({ error: 'Class stream not found' });
        }
        res.status(200).json(formatStream(stream, stream._count.students));
    } catch (error) {
        next(error);
    }
};

const createStream = async (req, res, next) => {
    try {
        const { name, classLevel, capacity, classTeacherId } = req.body;
        if (!name || !classLevel || !classTeacherId) {
            return res.status(400).json({ error: 'Name, class level and class teacher are required' });
        }

        const stream = await prisma.classStream.create({
            data: {
                name: name.trim(),
                classLevel,
                capacity: parseInt(capacity, 10) || 40,
                classTeacherId: parseInt(classTeacherId, 10),
            },
            include: { classTeacher: true },
        });

        res.status(201).json(formatStream(stream, 0));
    } catch (error) {
        next(error);
    }
};

const updateStream = async (req, res, next) => {
    try {
        const data = { ...req.body };
        delete data.id;
        delete data.classTeacher;
        delete data.studentCount;
        if (data.classTeacherId) data.classTeacherId = parseInt(data.classTeacherId, 10);
        if (data.capacity) data.capacity = parseInt(data.capacity, 10);

        const stream = await prisma.classStream.update({
            where: { id: parseInt(req.params.id, 10) },
            data,
            include: {
                classTeacher: true,
                _count: { select: { students: { where: { status: 'Active' } } } },
            },
        });

        await logActivity({
            action: 'Stream updated',
            detail: `${stream.name} updated`,
            type: 'stream',
        });

        res.status(200).json(formatStream(stream, stream._count.students));
    } catch (error) {
        next(error);
    }
};

const deleteStream = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const studentCount = await prisma.student.count({ where: { streamId: id } });

        if (studentCount > 0) {
            return res.status(400).json({
                error: `Cannot delete stream with ${studentCount} enrolled student(s). Reassign or remove them first.`,
            });
        }

        await prisma.classStream.delete({ where: { id } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStreams,
    getStreamsSimple,
    getStreamById,
    createStream,
    updateStream,
    deleteStream,
};
