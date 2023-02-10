import bcrypt from "bcrypt";
import { Response } from "express";

export const hashPassword = async (pass: string): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(pass, 12);
    return hashedPassword;
  } catch (error) {
    return null;
  }
};

export const handleError = async (
  res: Response,
  error: any,
  status?: number
) => {
  return res.status(status || 400).send({ error: new Error(error).message });
};
