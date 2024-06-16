import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index.routes.js';
import publicRouter from './routes/public.routes.js';
import errorController from './controllers/error/index.controller.js';
import cors from 'cors';
import authenticateToken from './middlewares/authenticateToken.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const { HTTP_PORT } = process.env;
const app = express();
const corsOptions = {
    origin: process.env.SITE_URL,
    credentials: true
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(publicRouter);
app.use((req, res, next) => {
    if (req.path === '/logout') {
        return next();
    }
    authenticateToken(req, res, next);
});
app.use(router);
app.use(errorController)

app.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
});