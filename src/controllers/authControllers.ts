import { compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { UserLoginType, UserType } from '../types/userTypes';
import { loginValidation } from '../utils/validations';

export async function checkUserExist(email: string) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    return false;
  }
}

export async function validateLoginCredentials(req: Request<any, any, UserLoginType>, res: Response, next: NextFunction) {
  const { error } = loginValidation(req.body);
  if (!!error) return res.status(400).send(error?.details[0].message);
  next();
}

export async function findUserByEmailAndPassword(req: Request<any, any, UserLoginType>, res: Response, next: NextFunction) {
  const user = await checkUserExist(req.body.email);
  if (!user) return res.status(400).send("Email or password is wrong");
  const passwordIsValid = await compare(req.body.password, user.password);
  if (!passwordIsValid) return res.status(400).send("Password is wrong");
  res.locals = { ...res.locals, user };
  next();
}

