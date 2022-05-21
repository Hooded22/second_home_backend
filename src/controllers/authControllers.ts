import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import { ac } from "../config/appConfig";
import User from "../models/userModel";
import {
  UserLoginType,
  IUser,
  UserRoles,
  UserDetailsType,
} from "../types/userTypes";
import CustomResponse from "../utils/CustomResponse";
import { getUserByEmail } from "../utils/getUserByEmail";
import { loginValidation, registerValidation } from "../utils/validations";

export async function validateRegisterCredentials(
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction
) {
  const { error } = registerValidation(req.body);
  if (!!error) return res.status(400).send(error?.details[0].message);
  next();
}

export async function checkUserExist(
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction
) {
  const userAlreadyExist = await getUserByEmail(req.body.email);
  if (userAlreadyExist) return res.status(400).send("User already exist.");
  next();
}

export async function validateLoginCredentials(
  req: Request<any, any, UserLoginType>,
  res: Response,
  next: NextFunction
) {
  const { error } = loginValidation(req.body);
  if (!!error) return res.status(400).send(error?.details[0].message);
  next();
}

export async function findUserByEmailAndPassword(
  req: Request<any, any, UserLoginType>,
  res: Response,
  next: NextFunction
) {
  const user = await getUserByEmail(req.body.email);
  if (!user) return res.status(400).send("Email or password is wrong");
  const passwordIsValid = await compare(req.body.password, user.password);
  if (!passwordIsValid) return res.status(400).send("Password is wrong");
  res.locals = { ...res.locals, user };
  next();
}

export async function saveUserToken(token: string, userId: string) {
  User.findOneAndUpdate({ _id: userId }, { token });
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
