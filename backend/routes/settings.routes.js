const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const { getSettings, updateSettings } = require('../controllers/settings.controller');

const router = express.Router();

router.use(protect);

router.get('/', getSettings);
router.put('/', authorize('admin'), updateSettings);

module.exports = router;
