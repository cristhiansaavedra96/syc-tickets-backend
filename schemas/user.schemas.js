import joi from 'joi';
import imgSchema from './img.schemas.js'
import joiMsg from './joi.messages.js'

const editAvatarSchema = joi.object({
    avatar: imgSchema.required()
});

const login = joi.object({
    email: joi.string().email().required().messages(joiMsg.errorMsg)
})

const passwordChangeSchema = joi.object({
    oldPass: joi
        .string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({ ...joiMsg.errorMsg, ...joiMsg.errorMsgPassword }),
    newPass: joi
        .string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({ ...joiMsg.errorMsg, ...joiMsg.errorMsgPassword })
})

const passwordRecover = joi.object({
    email: joi.string().email().required().messages(joiMsg.errorMsg)
})

const passwordUpdateByRecoverSchema = joi.object({
    recoverPassCode: joi
        .string()
        .min(10)
        .max(10)
        .required()
        .messages(joiMsg.errorMsg),
    newPass: joi
        .string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({ ...joiMsg.errorMsg, ...joiMsg.errorMsgPassword })
})

const registerSchema = joi.object({
    email: joi.string().email().required().messages(joiMsg.errorMsg),
    name: joi.string().required().messages(joiMsg.errorMsg),
})

const validateSchema = joi.object({
    activationCode: joi
        .string()
        .min(30)
        .max(30)
        .required()
        .pattern(/^\S*$/)
        .messages({ ...joiMsg.errorMsg, ...joiMsg.errorMsgUsername }),
    password: joi
        .string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({ ...joiMsg.errorMsg, ...joiMsg.errorMsgPassword })
})

const userSchema = {
    editAvatarSchema,
    login,
    passwordChangeSchema,
    passwordRecover,
    passwordUpdateByRecoverSchema,
    registerSchema,
    validateSchema
}

export default userSchema;