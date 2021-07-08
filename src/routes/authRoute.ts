import express, { Request, Response } from "express";
import { IUserSchema, UserType, UserLoginType } from "../types/userTypes";
import User from "../models/userModel";
import { checkUserExist } from "../controllers/authControllers";
import { loginValidation, registerValidation } from "../utils/validations";
import { hash, compare } from 'bcrypt';

//TODO: Write tests

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
    try {
      const result = await newUser.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

authRoute.post('/login', async (req: Request<any, any, UserLoginType>, res: Response) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (!!error) return res.status(400).send(error?.details[0].message);
  const user = await checkUserExist(email);
  if (!user) return res.status(400).send("Email or password is wrong");
  const passwordIsValid = await compare(password, user.password);
  if (!passwordIsValid) return res.status(400).send("Password is wrong");
  res.status(200).send("Success");
})



export default authRoute;
