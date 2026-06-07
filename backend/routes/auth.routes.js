const express = require('express');
const {
    loginAdmin,
    loginStudent,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword,
    registerAdmin,
} = require('../controllers/auth.controller');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');

const authRouter = express.Router();

authRouter.post('/admin/login', loginAdmin);
authRouter.post('/student/login', loginStudent);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', protect, getMe);

authRouter.post('/admin/register', protect, authorize('admin'), registerAdmin);

module.exports = authRouter;
