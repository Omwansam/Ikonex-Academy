const { prisma } = require('../config/db');

async function logActivity({ action, detail, type }) {
    try {
        await prisma.activityLog.create({
            data: { action, detail, type },
        });
    } catch (err) {
        console.error('Failed to log activity:', err.message);
    }
}

module.exports = { logActivity };
