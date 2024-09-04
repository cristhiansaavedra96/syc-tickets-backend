import express from 'express';
import userController from '../controllers/user.controller.js';
import { recipes } from '../services/recipes.js';

const router = express.Router();

router.post('/login', userController.login)
router.post('/password/recover', userController.passwordRecover)
router.put('/password/recover', userController.passwordUpdateByRecoverCode)
router.post('/validate/', userController.validate)
router.get('/health-check', (req, res) => res.send('OK'))

//get recipes from services/recipes.json

router.get('/recipes', async (req, res) => {
    res.send(recipes)
})

export default router;