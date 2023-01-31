import { Request, Response, NextFunction } from "express";
import { ICreateFeedbackRequest } from "./types";
import { addFeedbackValidation } from "./validator";

export async function validateAddFeedbackData(
  req: Request<any, any, ICreateFeedbackRequest>,
  res: Response,
  next: NextFunction
) {
  const { error } = addFeedbackValidation(req.body);
  if (!!error) return res.status(400).send(error.details[0].message);
  next();
}
