const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getAllAssessments,
    getAssessmentById,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentScores,
    submitScore,
    updateScore,
} = require('../controllers/assessment.controller');

const router = express.Router();
const scoreRouter = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAllAssessments);
router.get('/:id/scores', getAssessmentScores);
router.post('/:id/scores', submitScore);
router.get('/:id', getAssessmentById);
router.post('/', createAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

scoreRouter.use(protect, authorize('admin'));
scoreRouter.put('/:id', updateScore);

module.exports = { assessmentRouter: router, scoreRouter };
