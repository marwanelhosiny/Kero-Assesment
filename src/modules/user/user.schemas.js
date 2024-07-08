import Joi from "joi";


export const signupSchema = {
    body: Joi.object({
        fullName: Joi.string().min(2).max(40).required(),
        email: Joi.string().email(),
        password: Joi.string().min(6).max(20).required(),
        phone: Joi.string().pattern(/^\+2/).length(13).required()
    })
}

export const signinSchema = {
    body: Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(6).max(20).required()
    })
}

