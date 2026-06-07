const { prisma } = require('../config/db');
const { paginate, parsePaginationQuery } = require('../utils/pagination');

const getAllTeachers = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const { page, pageSize } = parsePaginationQuery(req.query);

        const where = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ];
        }

        const teachers = await prisma.teacher.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        res.status(200).json(paginate(teachers, page, pageSize));
    } catch (error) {
        next(error);
    }
};

const getTeacherById = async (req, res, next) => {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id: parseInt(req.params.id, 10) },
        });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        next(error);
    }
};

const createTeacher = async (req, res, next) => {
    try {
        const { name, email, phone, subject, status } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const teacher = await prisma.teacher.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone || '',
                subject: subject || '',
                status: status || 'Active',
            },
        });

        res.status(201).json(teacher);
    } catch (error) {
        next(error);
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const data = { ...req.body };
        delete data.id;
        if (data.email) data.email = data.email.trim().toLowerCase();

        const teacher = await prisma.teacher.update({
            where: { id: parseInt(req.params.id, 10) },
            data,
        });

        res.status(200).json(teacher);
    } catch (error) {
        next(error);
    }
};

const deleteTeacher = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [streamCount, subjectCount] = await Promise.all([
            prisma.classStream.count({ where: { classTeacherId: id } }),
            prisma.subject.count({ where: { teacherId: id } }),
        ]);

        if (streamCount > 0 || subjectCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete teacher assigned to class streams or subjects. Reassign them first.',
            });
        }

        await prisma.teacher.delete({ where: { id } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
};
