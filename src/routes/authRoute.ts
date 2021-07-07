import express, { Request, Response } from "express";
import { IUserSchema, UserType, UserLoginType } from "../types/userTypes";
import User from "../models/userModel";
import { checkUserExist } from "../controllers/authControllers";
import {hashPassword} from '../utils/hashPassword';
import passport from "passport";

const authRoute = express.Router();

authRoute.use("/registration", checkUserExist);

authRoute.post(
  "/registration",
  async (req: Request<any, any, UserType>, res: Response) => {
    try {
      const body: UserType = req.body;
      const user: IUserSchema = {
        ...body,
        userName: body.firstName + body.lastName,
      };
      const newUser = new User(user);
      const result = await newUser.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

authRoute.post('/login', passport.authorize('local', {failureMessage: "Incorrect password", successMessage: "Success"}));


export default authRoute;
