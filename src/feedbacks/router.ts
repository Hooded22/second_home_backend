import { Router, Request, Response } from "express";
import FeedbackController from "./controller";
import { ICreateFeedbackRequest, IFeedbackFilters } from "./types";
import { ResponseLocalsType } from "../globals/types";
import auth from "../auth/middleware";
import { validateId, validateQueryId } from "../globals/validators";
import { validateAddFeedbackData } from "./validator";
import { handleError } from "../globals/utils";

const feedbackRoute = Router();
const feedbackController = new FeedbackController();

feedbackRoute.use("/", auth);

feedbackRoute.post(
  "/",
  validateAddFeedbackData,
  async (
    req: Request<any, any, ICreateFeedbackRequest>,
    res: Response<any, ResponseLocalsType>
  ) => {
    const author = req.user;
    const feedback = req.body;

    try {
      const resultData = await feedbackController.addFeedback(feedback, author);
      return res.status(200).json(resultData);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

feedbackRoute.get(
  "/",
  async (req: Request<any, any, any, IFeedbackFilters>, res: Response) => {
    const { status } = req.query;
    try {
      const feedbacks = await feedbackController.getFeedback(status);
      return res.status(200).json(feedbacks);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

feedbackRoute.post(
  "/confirm",
  validateId,
  async (req: Request<any, any, { id: string }>, res: Response) => {
    try {
      const result = await feedbackController.confirmFeedback(req.body.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

feedbackRoute.post(
  "/reject",
  validateId,
  async (req: Request<any, any, { id: string }>, res: Response) => {
    try {
      const result = await feedbackController.rejectFeedback(req.body.id);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
);

feedbackRoute.delete(
  "/",
  validateQueryId,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      const result = feedbackController.deleteFeedback(req.query.id);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
);

export default feedbackRoute;
