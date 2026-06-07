const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getAllNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} = require('../controllers/notification.controller');

const router = express.Router();

router.use(protect);

router.get('/unread-count', getUnreadCount);
router.get('/', getAllNotifications);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.post('/', authorize('admin'), createNotification);

module.exports = router;
