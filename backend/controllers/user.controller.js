const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { name } = req.body;
        const data = {};

        if (name !== undefined && name !== null) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({ success: false, error: 'Name is required' });
            }
            data.name = name.trim();
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, error: 'No profile fields to update' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data,
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both current and new passwords',
            });
        }
        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters',
            });
        }

        if (req.user.role === 'student') {
            const student = await prisma.student.findUnique({
                where: { id: req.user.studentId },
            });
            if (!student) {
                return res.status(404).json({ success: false, error: 'Student not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, student.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, error: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.student.update({
                where: { id: student.id },
                data: { password: hashedPassword },
            });
        } else {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, error: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
        }

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === String(req.user.id)) {
            return res.status(400).json({ success: false, error: 'You cannot delete your own account' });
        }
        await prisma.user.delete({ where: { id: parseInt(req.params.id, 10) } });
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, deleteUser };
