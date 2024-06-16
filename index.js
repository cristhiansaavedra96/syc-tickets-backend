import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index.routes.js';
import publicRouter from './routes/public.routes.js';
import errorController from './controllers/error/index.controller.js';
import cors from 'cors';
import authenticateToken from './middlewares/authenticateToken.js';

dotenv.config();
const { PORT, SITE_URL } = process.env;
const app = express();

app.use(cors({
    origin: '*'
}))

app.use(express.json());

//Middleware to console.log all requests
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

//Rutas públicas
app.use(publicRouter);

//Rutas privadas
app.use((req, res, next) => {
    if (req.path === '/logout') {
        return next();
    }
    authenticateToken(req, res, next);
});

app.use(router);
app.use(errorController)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, SITE_URL: ${SITE_URL}`);
});