import Joi from "joi";
import { UserLoginType, IUser } from "../users/userTypes";

const registrationSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string().alphanum().min(2).max(120).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginSchema = Joi.object<UserLoginType>({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const registerValidation = (user: IUser) => {
  return registrationSchema.validate(user);
};

export const loginValidation = (userCredentials: UserLoginType) => {
  return loginSchema.validate(userCredentials);
};
