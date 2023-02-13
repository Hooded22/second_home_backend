import Joi from "joi";
import { UserLoginType, IUser, UserRoles, IUserSchema } from "../users/types";
import CustomResponse from "../globals/CustomResponse";
import { getUserByEmail } from "../users/utils";
import { handleError } from "../globals/utils";
import { NextFunction, Request, Response } from "express";
import { User as UserType } from "../../custom";
import errorMessages from "../assets/errorMessages";
import { compare } from "bcrypt";
import { ac } from "../config/appConfig";
import { RegisterResponseLocalsType } from "./types";

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

export async function validateRegisterCredentials(
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction
) {
  const { error } = registerValidation(req.body);
  if (!!error) {
    return handleError(res, error);
  }
  next();
}

export async function checkUserExist(
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction
) {
  const userAlreadyExist = await getUserByEmail(req.body.email);
  if (userAlreadyExist) {
    return handleError(res, errorMessages.userAlreadyExists);
  }
  next();
}

export async function validateLoginCredentials(
  req: Request<any, any, UserLoginType>,
  res: Response,
  next: NextFunction
) {
  const { error } = loginValidation(req.body);
  if (!!error) {
    return handleError(res, error);
  }
  next();
}

export async function findUserByEmailAndPassword(
  req: Request<any, any, UserLoginType>,
  res: Response,
  next: NextFunction
) {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return handleError(res, "Email or password is wrong");
  }
  const passwordIsValid = await compare(req.body.password, user.password);
  if (!passwordIsValid) {
    return handleError(res, "Email or password is wrong");
  }
  res.locals = { ...res.locals, user };
  req.user = user as UserType;
  next();
}

export async function validateGrandUserData(
  req: Request<any, any, { userId: string; newRole: UserRoles }>,
  res: Response,
  next: NextFunction
) {
  const permissions = ac
    .can(req.user?.role || UserRoles.CUSTOMER)
    .update("stuffPermissions");

  try {
    if (!permissions.granted) throw new Error(errorMessages.permissionDenied);
    if (!req.body.userId || !req.body.newRole)
      throw new Error(errorMessages.internalError);
    next();
  } catch (error: any) {
    return res.status(400).send(new CustomResponse(null, error).json());
  }
}

export async function validateLocaleUser(
  req: Request<any, any, UserLoginType>,
  res: Response<any, RegisterResponseLocalsType>,
  next: NextFunction
) {
  if (!res.locals.user) {
    return handleError(res, errorMessages.internalError);
  } else {
    next();
  }
}
