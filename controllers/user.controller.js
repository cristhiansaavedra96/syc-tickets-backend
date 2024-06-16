import userService from "../services/user.service.js";
import bcrypt from "bcrypt";
import securityService from "../services/security.service.js";
import errors from "../helpers/errors.helper.js";
import userSchema from "../schemas/user.schemas.js";
import validateSchema from "../helpers/validate.helper.js";
import randomstring from 'randomstring'

const getUserByEmail = async (req, res, next) => {
    let mail = req.params.email;
    try {
        let user = await userService.getUserByEmail(mail);
        if (user) {
            delete user.password;
        }
        res.status(200).send({
            found: user ? true : false,
            user: user || null
        });
    } catch (error) {
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    console.log('get users')
    try {
        const users = await userService.getUsers();
        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        await validateSchema(userSchema.login, { email: req.body.email });

        const user = await userService.getUserByEmail(req.body.email);

        if (!user) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND')
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            errors.notFoundError('Credenciales incorrectas', 'INVALID_CREDENTIALS')
        }

        if (!user.active) {
            if (user.activationCode !== null) {
                errors.forbiddenError('El usuario aún no fue activado', 'PENDING_ACTIVATION')
            } else {
                errors.forbiddenError('El usuario está desactivado', 'USER_INACTIVE')
            }
        }

        const tokenInfo = {
            id: user.id,
            level: user.level
        }

        const token = await securityService.createToken(tokenInfo);

        res.send({
            status: "success",
            message: "Usuario logueado con éxito",
            token
        })

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        // Eliminar la cookie del token
        res.clearCookie('syc-tickets-token', {
            httpOnly: true,  // Asegura que la cookie no sea accesible desde JavaScript
            secure: process.env.NODE_ENV === 'production'  // Solo se envía a través de HTTPS en producción
        });

        // Enviar la respuesta
        res.send({
            status: "success",
            message: "Usuario deslogueado con éxito"
        });

    } catch (error) {
        next(error);
    }
}

const passwordRecover = async (req, res, next) => {
    try {
        //validacion
        await validateSchema(userSchema.passwordRecover, req.body);

        const { email } = req.body;
        const user = await userService.getUserByEmail(email);

        if (!user) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        const recoverPassCode = randomstring.generate(10);
        await userService.updateRecoverPassCode(email, recoverPassCode);
        await userService.recoverPasswordSendMail(user.email, recoverPassCode);

        res.send({
            status: "success",
            message: "Código para recuperar contraseña enviado con éxito"
        })
    } catch (error) {
        next(error);
    }
}

const passwordUpdateByRecoverCode = async (req, res, next) => {
    try {
        //Validamos
        await validateSchema(userSchema.passwordUpdateByRecoverSchema, req.body)
        const { recoverPassCode, newPass } = req.body

        const users = await userService.getUserByRecoverPassCode(recoverPassCode)

        if (users.length === 0 || !users[0].recoveryPasswordCode) {
            errors.conflictError(
                'El usuario no solicitó una recuperación de contraseña.',
                'INVALID_RECOVER_PASS_ERROR'
            )
        }

        const user = users[0]

        if (user.recoveryPasswordCode !== recoverPassCode) {
            errors.notAuthorizedError(
                'El código de recuperación es incorrecto.',
                'RECOVER_PASS_CODE_ERROR'
            )
        }

        user.password = await bcrypt.hash(newPass, 5);

        await userService.updatePassword(user)

        res.send({
            status: "success",
            message: "Contraseña actualizada con éxito"
        })

    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try {
        //recibir info en req que vamos a tener que validar 
        await validateSchema(userSchema.registerSchema, req.body);
        const { email, name } = req.body;

        //Generamos código aleatorio
        const activationCode = randomstring.generate(30);

        //Validamos que no exista un usuario ya registrado
        const userFromDb = await userService.getUserByEmail(email);
        if (userFromDb) {
            errors.conflictError('El email ya se encuentra registrado', 'USER_REGISTER_ERROR');
        }

        //Registramos
        let user = {
            email,
            name,
            activationCode
        }
        await userService.register(user);

        //enviamos Email
        await userService.registerSendMail(email, activationCode);

        res.send({
            status: "success",
            message: "Usuario registrado con éxito"
        })

    } catch (error) {
        next(error);
    }
};

const validate = async (req, res, next) => {
    try {
        //Validar schema
        await validateSchema(userSchema.validateSchema, req.body)
        const { activationCode, password } = req.body
        const users = await userService.getUserByActivationCode(activationCode)

        if (users.length > 1) {
            errors.conflictError(
                'Hemos detectado más de un usuario con el mismo código de activación',
                'USER_VALIDATE_ERROR'
            )
        }

        if (users.length == 0) {
            errors.conflictError(
                'Usuario activado con anterioridad',
                'USER_VALIDATE_ERROR'
            )
        }

        let user = users[0]

        await userService.activate(activationCode)
        user.password = await bcrypt.hash(password, 5);
        await userService.updatePassword(user)

        res.send({
            status: "success",
            message: "Usuario activado con éxito"
        })

    } catch (error) {
        next(error)
    }
}

const userController = {
    getUserByEmail,
    getUsers,
    login,
    passwordRecover,
    passwordUpdateByRecoverCode,
    register,
    validate,
    logout
}

export default userController;