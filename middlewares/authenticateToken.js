import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {

    // Obtenemos el token del header 'Authorization'
    const authHeader = req.headers['authorization'];

    // Verificamos si existe el token en el header
    if (!authHeader) {
        return res.status(403).json({
            status: "error",
            message: "No token provided.",
            error: "NO_TOKEN_PROVIDED"
        });
    }

    // El token normalmente viene en formato 'Bearer <token>', separado por espacios
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({
            status: "error",
            message: "No token provided.",
            error: "NO_TOKEN_PROVIDED"
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).send({
                status: "error",
                message: "Unauthorized.",
                error: "INVALID_TOKEN"
            });
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;