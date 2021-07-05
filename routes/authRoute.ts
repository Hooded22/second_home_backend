import express, { Request } from "express";
import { IUserSchema, UserType } from "../types/userTypes";
import User from "../models/userModel";

const authRoute = express.Router();

authRoute.post(
  "/registration",
  async (req: Request<any, any, UserType>, res) => {
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

export default authRoute;
