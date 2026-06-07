const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getAttendanceByStreamAndDate,
    saveAttendance,
    getStudentAttendanceSummary,
    getStreamAttendanceStats,
} = require('../controllers/attendance.controller');

const router = express.Router();

router.use(protect);

router.get('/student/:studentId/summary', getStudentAttendanceSummary);
router.get('/streams/:streamId/stats', authorize('admin'), getStreamAttendanceStats);
router.get('/', authorize('admin'), getAttendanceByStreamAndDate);
router.post('/', authorize('admin'), saveAttendance);

module.exports = router;
