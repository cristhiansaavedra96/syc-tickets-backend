import express from 'express';

const router = express.Router();

router.get('/tickets', (req, res) => {
    res.send('Hello World tickets!');
});

export default router;