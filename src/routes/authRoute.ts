import express, { Request, Response } from "express";
import {
  IUser,
  UserDetailsType,
  UserLoginType,
  UserRoles,
} from "../users/types";
import User from "../users/model";
import {
  checkUserExist,
  validateLoginCredentials,
  findUserByEmailAndPassword,
  validateRegisterCredentials,
  saveUserToken,
  validateGrandUserData,
} from "../controllers/authControllers";
import { hash } from "bcrypt";
import { RegisterResponseLocalsType } from "../types/middlewaresTypes/authMiddlewaresTypes";
import { Secret, sign } from "jsonwebtoken";
import config, { ac } from "../config/appConfig";
import errorMessages from "../assets/errorMessages";
import auth from "./verifyToken";
import CustomResponse from "../utils/CustomResponse";

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
    const token = sign(
      { _id: res.locals.user._id, role: req.user?.role },
      tokenSecret
    );
    const { firstName, lastName, email, _id, role } = res.locals.user;
    const userDetails: UserDetailsType = {
      firstName,
      lastName,
      email,
      role,
    };
    saveUserToken(token, _id);
    res.header("auth-token").json({
      token,
      userDetails,
    });
  }
);

authRoute.post(
  "/grandUser",
  auth,
  validateGrandUserData,
  async (
    req: Request<any, any, { userId: string; newRole: UserRoles }>,
    res: Response
  ) => {
    try {
      const user = User.findByIdAndUpdate(req.body.userId, {
        role: req.body.newRole,
      });
      if (!user) {
        return res.status(400).send(errorMessages.incorectId);
      }
      res.status(200).send({ message: "User granded successfully" });
    } catch (error) {
      return res.status(400).send(errorMessages.incorectId);
    }
  }
);

export default authRoute;
