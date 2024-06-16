import { PrismaClient } from "@prisma/client";
import errors from "../helpers/errors.helper.js";
import sendMail from "../helpers/email.helper.js";
const prisma = new PrismaClient();

const activate = async (activationCode) => {
    try {
        await prisma.users.updateMany({
            where: {
                activationCode: activationCode
            },
            data: {
                active: "S",
                activationCode: ''
            }
        });
    } catch (error) {
        console.log(error)
        errors.conflictError('Error al activar el usuario', 'USER_NOT_FOUND')
    }
}

const getUserByActivationCode = async (activationCode) => {
    try {
        const user = await prisma.users.findMany({
            where: {
                activationCode: activationCode
            }
        });
        return user
    } catch (error) {
        errors.conflictError('Error al buscar usuario', 'USER_NOT_FOUND')
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        return user
    } catch (error) {
        errors.conflictError('Error al buscar usuario', 'USER_NOT_FOUND')
    }
}

const getUserByRecoverPassCode = async (recoverPassCode) => {
    try {
        const users = await prisma.users.findMany({
            where: {
                recoveryPasswordCode: recoverPassCode
            }
        });
        return users
    } catch (error) {
        console.log(error)
        errors.conflictError('Error al buscar usuario', 'USER_NOT_FOUND_BY_RECOVER_PASSWORD')
    }
}

const getUsers = async () => {
    try {
        const users = await prisma.users.findMany();
        return users
    } catch (error) {
        errors.conflictError('Error al buscar usuarios', 'USERS_NOT_FOUND')
    }
}

const recoverPasswordSendMail = async (email, recoverPassCode) => {
    const emailBody = `
        Se ha solicitado la recuperación de contraseña para este email. 
                    
        Haz click en el siguiente enlace para generar una nueva contraseña: ${process.env.SITE_URL + '/recover-password/' + recoverPassCode}

        Si no has sido tú ignora este email.
    `;
    const emailSubject = `Recuperación de contraseña`;

    await sendMail(email, emailSubject, emailBody);
}

const register = async (userData) => {
    try {
        const user = await prisma.users.create({
            data: {
                email: userData.email,
                name: userData.name,
                activationCode: userData.activationCode,
                password: ''
            },
        })
        return user
    } catch (error) {
        errors.conflictError('Error al registrar el usuario', 'USER_NOT_CREATED_DB')
    }
};

const registerSendMail = async (email, activationCode) => {
    const emailBody = `
        Bienvenido al sistema de requerimientos de SYC Software. 
                    
        Haz click en el siguiente enlace para generar una nueva contraseña: ${process.env.SITE_URL + '/activation/' + activationCode}

    `;
    const emailSubject = `Bienvenido al sistema de requerimientos de SYC Software`;

    await sendMail(email, emailSubject, emailBody);
}

const updatePassword = async (user) => {
    try {
        await prisma.users.update({
            where: {
                email: user.email
            },
            data: {
                password: user.password
            }
        });
    } catch (error) {
        errors.conflictError('Error al actualizar contraseña', 'USER_NOT_FOUND')
    }
}

const updateRecoverPassCode = async (email, recoverPassCode) => {
    try {
        const updatedUser = await prisma.users.update({
            where: {
                email: email
            },
            data: {
                recoveryPasswordCode: recoverPassCode
            }
        });
    } catch (error) {
        errors.conflictError('Error al actualizar el usuario', 'ERROR_UPDATING_RECOVERY_PASS')
    }
}

const userService = {
    getUsers,
    getUserByEmail,
    getUserByActivationCode,
    activate,
    recoverPasswordSendMail,
    updateRecoverPassCode,
    updatePassword,
    getUserByRecoverPassCode,
    register,
    registerSendMail
}

export default userService;