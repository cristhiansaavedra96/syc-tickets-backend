import joi from 'joi'
import joiMsg from '../joi.messages.js'

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

export default passwordChangeSchema