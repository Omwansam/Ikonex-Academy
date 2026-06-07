const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware');
const { getProfile, updateProfile, changePassword, getAllUsers, deleteUser } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.use(protect);

userRouter.put('/change-password', changePassword);
userRouter.get('/profile', authorize('admin'), getProfile);
userRouter.put('/profile', authorize('admin'), updateProfile);
userRouter.get('/', authorize('admin'), getAllUsers);
userRouter.delete('/:id', authorize('admin'), deleteUser);

module.exports = userRouter;