const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getDashboardStats,
    getRecentActivities,
    getPerformanceTrends,
    getSubjectPerformance,
    getStreamDistribution,
    getGradeDistribution,
    getStudentResultsHandler,
    getClassResults,
    getSubjectResultsHandler,
    getRankings,
    getReportCard,
    getTopStudents,
    getBottomStudents,
} = require('../controllers/report.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);
router.get('/performance-trends', getPerformanceTrends);
router.get('/subject-performance', getSubjectPerformance);
router.get('/stream-distribution', getStreamDistribution);
router.get('/grade-distribution', getGradeDistribution);
router.get('/rankings', getRankings);
router.get('/top-students', getTopStudents);
router.get('/bottom-students', getBottomStudents);
router.get('/students/:id/results', getStudentResultsHandler);
router.get('/students/:id/report-card', getReportCard);
router.get('/streams/:id/results', getClassResults);
router.get('/subjects/:id/results', getSubjectResultsHandler);

module.exports = router;
