const { prisma } = require('../config/db');

function filterNotifications(notifications, { role, studentId }) {
    return notifications.filter((n) => {
        if (n.audience === 'all') return true;
        if (role === 'admin') return n.audience === 'admin';
        if (role === 'student') {
            return n.audience === 'student' && (!n.studentId || n.studentId === studentId);
        }
        return false;
    });
}

const getAllNotifications = async (req, res, next) => {
    try {
        const role = req.query.role || req.user.role;
        const studentId = req.query.studentId
            ? parseInt(req.query.studentId, 10)
            : req.user.role === 'student'
              ? req.user.studentId
              : undefined;

        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const filtered = filterNotifications(notifications, { role, studentId });
        res.status(200).json(filtered);
    } catch (error) {
        next(error);
    }
};

const createNotification = async (req, res, next) => {
    try {
        const { title, message, type, audience, studentId } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }

        const notification = await prisma.notification.create({
            data: {
                title: title.trim(),
                message: message.trim(),
                type: type || 'info',
                audience: audience || 'all',
                studentId: studentId ? parseInt(studentId, 10) : null,
            },
        });

        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: parseInt(req.params.id, 10) },
            data: { read: true },
        });
        res.status(200).json(notification);
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const role = req.body.role || req.user.role;
        const studentId = req.body.studentId
            ? parseInt(req.body.studentId, 10)
            : req.user.role === 'student'
              ? req.user.studentId
              : undefined;

        const notifications = await prisma.notification.findMany();
        const filtered = filterNotifications(notifications, { role, studentId });
        const ids = filtered.map((n) => n.id);

        if (ids.length) {
            await prisma.notification.updateMany({
                where: { id: { in: ids } },
                data: { read: true },
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const role = req.query.role || req.user.role;
        const studentId = req.query.studentId
            ? parseInt(req.query.studentId, 10)
            : req.user.role === 'student'
              ? req.user.studentId
              : undefined;

        const notifications = await prisma.notification.findMany({
            where: { read: false },
        });

        const filtered = filterNotifications(notifications, { role, studentId });
        res.status(200).json(filtered.length);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
