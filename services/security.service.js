import jwt from 'jsonwebtoken';

const createToken = (tokenInfo) => {
    const { SECRET_KEY, EXPIRE_TOKEN } = process.env;
    const token = jwt.sign(tokenInfo, SECRET_KEY, {
        expiresIn: EXPIRE_TOKEN
    })
    return token;
}

const securityService = {
    createToken
}

export default securityService;