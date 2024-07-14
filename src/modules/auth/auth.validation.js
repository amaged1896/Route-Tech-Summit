import joi from 'joi';

export const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    passwordConfirm: joi.string().valid(joi.ref('password')).required(),
}).required();

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).required();
