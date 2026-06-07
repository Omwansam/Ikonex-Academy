const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { paginate, parsePaginationQuery } = require('../utils/pagination');
const { formatStudent } = require('../utils/formatters');
const { logActivity } = require('../utils/activityLog');

const DEFAULT_STUDENT_PASSWORD = 'student123';

const getAllStudents = async (req, res, next) => {
    try {
        const { search, streamId, status } = req.query;
        const { page, pageSize } = parsePaginationQuery(req.query);

        const where = {};
        if (streamId) where.streamId = parseInt(streamId, 10);
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { admissionNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        const students = await prisma.student.findMany({
            where,
            include: { stream: true },
            orderBy: { createdAt: 'desc' },
        });

        const formatted = students.map(formatStudent);
        res.status(200).json(paginate(formatted, page, pageSize));
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(req.params.id, 10) },
            include: { stream: true },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(formatStudent(student));
    } catch (error) {
        next(error);
    }
};

const createStudent = async (req, res, next) => {
    try {
        const {
            admissionNumber,
            firstName,
            lastName,
            gender,
            nationality,
            dateOfBirth,
            streamId,
            admissionDate,
            parentName,
            parentPhone,
            parentEmail,
            status,
            password,
        } = req.body;

        if (!admissionNumber || !firstName || !lastName || !streamId) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const plainPassword = password || DEFAULT_STUDENT_PASSWORD;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const student = await prisma.student.create({
            data: {
                admissionNumber: admissionNumber.trim().toUpperCase(),
                password: hashedPassword,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                gender: gender || 'Male',
                nationality: nationality || 'Kenyan',
                dateOfBirth: new Date(dateOfBirth),
                streamId: parseInt(streamId, 10),
                admissionDate: new Date(admissionDate || Date.now()),
                parentName: parentName || '',
                parentPhone: parentPhone || '',
                parentEmail: parentEmail || null,
                status: status || 'Active',
            },
            include: { stream: true },
        });

        await logActivity({
            action: 'New student registered',
            detail: `${student.firstName} ${student.lastName} (${student.admissionNumber})`,
            type: 'student',
        });

        res.status(201).json(formatStudent(student));
    } catch (error) {
        next(error);
    }
};

const UPDATABLE_FIELDS = [
    'admissionNumber',
    'firstName',
    'lastName',
    'gender',
    'nationality',
    'dateOfBirth',
    'streamId',
    'admissionDate',
    'parentName',
    'parentPhone',
    'parentEmail',
    'status',
    'profileImage',
];

const updateStudent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = {};

        for (const field of UPDATABLE_FIELDS) {
            if (req.body[field] !== undefined) data[field] = req.body[field];
        }

        if (data.admissionNumber) data.admissionNumber = data.admissionNumber.trim().toUpperCase();
        if (data.streamId) data.streamId = parseInt(data.streamId, 10);
        if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);
        if (data.admissionDate) data.admissionDate = new Date(data.admissionDate);

        const student = await prisma.student.update({
            where: { id },
            data,
            include: { stream: true },
        });

        res.status(200).json(formatStudent(student));
    } catch (error) {
        next(error);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        await prisma.student.delete({ where: { id: parseInt(req.params.id, 10) } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

const getStudentStats = async (req, res, next) => {
    try {
        const [total, active] = await Promise.all([
            prisma.student.count(),
            prisma.student.count({ where: { status: 'Active' } }),
        ]);
        res.status(200).json({ total, active, inactive: total - active });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
};
