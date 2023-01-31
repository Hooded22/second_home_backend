import Joi from "joi";
import { ICreateFeedbackRequest } from "./types";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

const addFeedbackSchema = Joi.object<ICreateFeedbackRequest>({
  title: Joi.string().min(3).max(256).required(),
  description: Joi.string().max(500),
  rate: Joi.number().min(0).max(5).required(),
});

export function addFeedbackValidation(feedback: ICreateFeedbackRequest) {
  return addFeedbackSchema.validate(feedback);
}

export async function validateAddFeedbackData(
  req: Request<any, any, ICreateFeedbackRequest>,
  res: Response,
  next: NextFunction
) {
  const { error } = addFeedbackValidation(req.body);
  if (!!error) return res.status(400).send(error.details[0].message);
  next();
}
