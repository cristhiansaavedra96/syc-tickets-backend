import joi from 'joi'
import joiMsg from '../joi.messages.js'

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

export default validateSchema;