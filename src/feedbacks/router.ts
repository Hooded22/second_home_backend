import { Router, Request, Response } from "express";
import FeedbackController from "./controller";
import { ICreateFeedbackRequest, IFeedbackFilters } from "./types";
import { ResponseLocalsType } from "../globals/types";
import auth from "../auth/middleware";
import { validateId } from "../globals/validators";
import { validateAddFeedbackData } from "./validator";

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
      res.status(200).json(resultData);
    } catch (error: any) {
      res.status(400).json(error?.message);
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
      return res.send(400).send(error?.message);
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
      return res.status(400).send(error.message);
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
      return res.status(400).send(error);
    }
  }
);

feedbackRoute.delete(
  "/",
  validateId,
  async (req: Request<any, any, { id: string }>, res: Response) => {
    try {
      const result = feedbackController.deleteFeedback(req.body.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

export default feedbackRoute;
