import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/users', userController.getUsers);
router.get('/users/:email', userController.getUserByEmail);
router.post('/users/register', userController.register)
router.post('/logout', userController.logout)

export default router;