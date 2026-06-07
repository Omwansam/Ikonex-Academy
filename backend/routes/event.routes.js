const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/event.controller');

const router = express.Router();

router.use(protect);

router.get('/', getAllEvents);
router.post('/', authorize('admin'), createEvent);
router.put('/:id', authorize('admin'), updateEvent);
router.delete('/:id', authorize('admin'), deleteEvent);

module.exports = router;
