const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const {
    getAllStreams,
    getStreamsSimple,
    getStreamById,
    createStream,
    updateStream,
    deleteStream,
} = require('../controllers/stream.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/simple', getStreamsSimple);
router.get('/', getAllStreams);
router.get('/:id', getStreamById);
router.post('/', createStream);
router.put('/:id', updateStream);
router.delete('/:id', deleteStream);

module.exports = router;
