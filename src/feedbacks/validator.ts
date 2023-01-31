import Joi from "joi";
import { ICreateFeedbackRequest } from "./types";

const addFeedbackSchema = Joi.object<ICreateFeedbackRequest>({
  title: Joi.string().min(3).max(256).required(),
  description: Joi.string().max(500),
  rate: Joi.number().min(0).max(5).required(),
});

export function addFeedbackValidation(feedback: ICreateFeedbackRequest) {
  return addFeedbackSchema.validate(feedback);
}
