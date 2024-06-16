import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', userController.login)
router.post('/password/recover', userController.passwordRecover)
router.put('/password/recover', userController.passwordUpdateByRecoverCode)
router.post('/validate/', userController.validate)
router.get('/health-check', (req, res) => res.send('OK'))

export default router;