import express, { Request } from "express";
import { IUserSchema, UserType } from "../types/userTypes";
import User from "../models/userModel";
import { checkUserExist } from "../controllers/authControllers";
import { registerValidation } from "../utils/validations";
import { hash } from 'bcrypt';

const authRoute = express.Router();

authRoute.post(
  "/registration",
  async (req: Request<any, any, UserType>, res) => {
    const { email, firstName, lastName, password } = req.body;
    const { error } = registerValidation(req.body);
    const userAlreadyExist = await checkUserExist(email);
    if (!!error) return res.status(400).send(error?.details[0].message);
    if (userAlreadyExist) return res.status(400).send("User already exist.");
    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      ...req.body,
      userName: `${firstName} ${lastName}`,
      password: hashedPassword
    });
    //Save user to db
    try {
      const result = await newUser.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

export default authRoute;