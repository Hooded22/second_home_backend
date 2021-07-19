import express, { Request, Response } from "express";
import { IUser, UserDetailsType, UserLoginType } from "../types/userTypes";
import User from "../models/userModel";
import {
  checkUserExist,
  validateLoginCredentials,
  findUserByEmailAndPassword,
  validateRegisterCredentials,
  saveUserToken,
} from "../controllers/authControllers";
import { hash } from "bcrypt";
import { RegisterResponseLocalsType } from "../types/middlewaresTypes/authMiddlewaresTypes";
import { Secret, sign } from "jsonwebtoken";
import config from "../config/appConfig";

//TODO: Write tests

const authRoute = express.Router();

authRoute.use("/registration", validateRegisterCredentials);
authRoute.use("/registration", checkUserExist);
authRoute.post("/registration", async (req: Request<any, any, IUser>, res) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await hash(password, 12);
  const newUser = new User({
    ...req.body,
    userName: `${firstName} ${lastName}`,
    password: hashedPassword,
  });
  try {
    const result = await newUser.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

authRoute.use("/login", validateLoginCredentials);
authRoute.use("/login", findUserByEmailAndPassword);
authRoute.post(
  "/login",
  async (
    req: Request<any, any, UserLoginType>,
    res: Response<any, RegisterResponseLocalsType>
  ) => {
    if (!res.locals.user) return res.status(500).send("Unrecognized error!");
    const tokenSecret: Secret = config.TOKEN_SECRET;
    const token = sign({ _id: res.locals.user._id }, tokenSecret);
    const { firstName, lastName, email, _id } = res.locals.user;
    const userDetails: UserDetailsType = {
      firstName,
      lastName,
      email,
    };
    saveUserToken(token, _id);
    res.header("auth-token").json({
      token,
      userDetails,
    });
  }
);

export default authRoute;
