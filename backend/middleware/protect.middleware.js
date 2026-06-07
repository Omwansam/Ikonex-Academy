const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { prisma } = require('../config/db');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: No token provided',
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (decoded.role === 'student') {
            const student = await prisma.student.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    admissionNumber: true,
                    firstName: true,
                    lastName: true,
                    status: true,
                },
            });

            if (!student || student.status !== 'Active') {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized: Student not found or inactive',
                });
            }

            req.user = {
                id: student.id,
                studentId: student.id,
                admissionNumber: student.admissionNumber,
                name: `${student.firstName} ${student.lastName}`,
                role: 'student',
            };
        } else {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true },
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized: User not found',
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Token expired. Please log in again',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid token',
            });
        }
        next(error);
    }
};

module.exports = protect;
