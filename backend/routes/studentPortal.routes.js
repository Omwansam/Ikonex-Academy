const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getDashboard,
    getProfile,
    updateProfile,
    getSubjects,
    getSubjectDetail,
    getResults,
    getAssessments,
    getTimetable,
    getRankings,
    getFees,
    getEvents,
    getReportCard,
    changePassword,
} = require('../controllers/studentPortal.controller');

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectDetail);
router.get('/results', getResults);
router.get('/assessments', getAssessments);
router.get('/timetable', getTimetable);
router.get('/rankings', getRankings);
router.get('/fees', getFees);
router.get('/events', getEvents);
router.get('/report-card', getReportCard);
router.put('/change-password', changePassword);

module.exports = router;
