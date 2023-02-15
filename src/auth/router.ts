import express, { Request, Response } from "express";
import { IUser, UserLoginType, UserRoles } from "../users/types";
import User from "../users/model";
import { RegisterResponseLocalsType } from "./types";
import errorMessages from "../assets/errorMessages";
import auth from "./middleware";
import { handleError } from "../globals/utils";
import { AuthController } from "./controller";
import {
  checkUserExist,
  findUserByEmailAndPassword,
  validateGrandUserData,
  validateLocaleUser,
  validateLoginCredentials,
  validateRegisterCredentials,
} from "./validations";

//TODO: Write tests

const authRoute = express.Router();
const authController = new AuthController();

authRoute.post(
  "/registration",
  validateRegisterCredentials,
  checkUserExist,
  async (req: Request<any, any, IUser>, res) => {
    try {
      const newUser = await authController.registerUser(req.body);
      return res.status(200).json(newUser);
    } catch (error) {
      return handleError(res, error);
    }
  }
);

authRoute.post(
  "/login",
  validateLoginCredentials,
  findUserByEmailAndPassword,
  validateLocaleUser,
  async (
    req: Request<any, any, UserLoginType>,
    res: Response<any, RegisterResponseLocalsType>
  ) => {
    try {
      const userDetailsAndToken = await authController.loginUser(
        res.locals.user!
      );
      return res.status(200).json(userDetailsAndToken);
    } catch (error) {
      return handleError(res, error);
    }
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
      const user = await authController.grandUserPermissions(
        req.body.userId,
        req.body.newRole
      );
      res.status(200).send({ message: "User granded successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }
);

export default authRoute;
