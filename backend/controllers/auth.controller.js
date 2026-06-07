const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');
const { prisma } = require('../config/db');

const secret = config.JWT_SECRET;
const expiresIn = config.JWT_EXPIRES_IN;

function jwtExpiresToMs(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value * 24 * 60 * 60 * 1000;
    }
    const s = String(value || '').trim();
    const m = /^(\d+)(s|m|h|d)$/i.exec(s);
    if (!m) return 7 * 24 * 60 * 60 * 1000;
    const n = parseInt(m[1], 10);
    const u = m[2].toLowerCase();
    const mult = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return n * mult[u];
}

function normalizeAdmissionNumber(value) {
    return String(value || '').trim().toUpperCase();
}

function buildStudentUser(student) {
    return {
        id: student.id,
        studentId: student.id,
        admissionNumber: student.admissionNumber,
        name: `${student.firstName} ${student.lastName}`,
        role: 'student',
    };
}

function buildAdminUser(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
    };
}

const sendTokenResponse = (payload, statusCode, res) => {
    if (!secret) {
        return res.status(500).json({
            success: false,
            error: 'Server misconfiguration: JWT_SECRET is not set',
        });
    }

    const { user, tokenPayload } = payload;
    const token = jwt.sign(tokenPayload, secret, { expiresIn });

    const options = {
        maxAge: jwtExpiresToMs(expiresIn),
        httpOnly: true,
    };

    if (config.NODE_ENV === 'production') {
        options.secure = true;
    }

    return res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ user, token });
};

const loginAdmin = async (req, res, next) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '').trim();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        sendTokenResponse(
            {
                user: buildAdminUser(user),
                tokenPayload: { id: user.id, role: 'admin' },
            },
            200,
            res,
        );
    } catch (error) {
        next(error);
    }
};

const loginStudent = async (req, res, next) => {
    try {
        const admissionNumber = normalizeAdmissionNumber(req.body.admissionNumber);
        const password = String(req.body.password || '').trim();

        if (!admissionNumber) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        const student = await prisma.student.findUnique({
            where: { admissionNumber },
        });

        if (!student) {
            return res.status(401).json({ error: 'No student found with this admission number' });
        }

        if (student.status !== 'Active') {
            return res.status(403).json({
                error: 'Your account is inactive. Contact the school office.',
            });
        }

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid admission number or password' });
        }

        sendTokenResponse(
            {
                user: buildStudentUser(student),
                tokenPayload: { id: student.id, studentId: student.id, role: 'student' },
            },
            200,
            res,
        );
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (user && user.role === 'admin') {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

            await prisma.user.update({
                where: { id: user.id },
                data: { resetToken, resetTokenExpiry },
            });

            if (config.NODE_ENV === 'development') {
                console.log(`Password reset token for ${email}: ${resetToken}`);
            }
        }

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Invalid reset request' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};

const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                role: 'admin',
            },
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            user: buildAdminUser(user),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin,
    loginStudent,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword,
    registerAdmin,
};
