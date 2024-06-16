import express from 'express';
import userRoutes from './user.routes.js';
import ticketRoutes from './ticket.routes.js';

const router = express.Router();

router.use(userRoutes);
router.use(ticketRoutes);

export default router;