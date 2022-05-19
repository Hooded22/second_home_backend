import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { UserLoginType, IUser } from "../types/userTypes";
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
