import Joi from 'joi';
import { UserType } from '../types/userTypes';

const registrationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    firstName: Joi.string()
        .alphanum()
        .min(2)
        .max(120)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
});

export const registerValidation = (user: UserType) => {
    return registrationSchema.validate(user);
}
