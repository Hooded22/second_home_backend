import { Request, Response } from "express";
import User from "../models/userModel";
import { UserType } from "../types/userTypes";

export async function checkUserExist(
  req: Request<any, any, UserType>,
  res: Response,
  next: () => void
) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json("User exist.");
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
