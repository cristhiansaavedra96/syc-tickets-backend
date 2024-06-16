import joi from 'joi'
import joiMsg from '../joi.messages.js'

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

export default passwordUpdateByRecoverSchema