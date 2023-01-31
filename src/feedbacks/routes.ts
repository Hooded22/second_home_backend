import { Router, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import { validateAddFeedbackData } from "./controller";
import Feedback from "./model";
import {
  ICreateFeedbackRequest,
  IFeedbackFilters,
  IFeedbackResponseData,
} from "./types";
import { ResponseLocalsType } from "../globals/types";
import auth from "../auth/middleware";

const feedbackRoute = Router();

feedbackRoute.use("/", auth);

feedbackRoute.post(
  "/",
  validateAddFeedbackData,
  async (
    req: Request<any, any, ICreateFeedbackRequest>,
    res: Response<any, ResponseLocalsType>
  ) => {
    const author = res.locals.user;
    const feedback = new Feedback({
      ...req.body,
      authorId: author?._id,
    });
    try {
      const result = await feedback.save();
      const { title, description, rate, creationDate, status } = result;
      const author = await result.getFeedbackAuthor();
      if (!author) return res.status(404).send(errorMessages.userNotFound);
      const resultData: IFeedbackResponseData = {
        title,
        description,
        rate,
        creationDate,
        status,
        author,
      };
      res.status(200).json(resultData);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

feedbackRoute.get(
  "/",
  async (req: Request<any, any, any, IFeedbackFilters>, res: Response) => {
    const { status } = req.query;
    try {
      if (status) {
        const feedbacks = await Feedback.findByStatus(status);
        return res.status(200).json(feedbacks);
      }
      const feedbacks = await Feedback.find();
      return res.status(200).json(feedbacks);
    } catch (error) {
      return res.send(400).send(error);
    }
  }
);

feedbackRoute.post(
  "/confirm",
  async (req: Request<any, any, { id: string }>, res: Response) => {
    const { id } = req.body;
    try {
      const result = await Feedback.modifyFeedbackStatus(id, 10);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

feedbackRoute.post(
  "/reject",
  async (req: Request<any, any, { id: string }>, res: Response) => {
    const { id } = req.body;
    try {
      const result = await Feedback.modifyFeedbackStatus(id, 20);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

feedbackRoute.delete(
  "/",
  async (req: Request<any, any, { id: string }>, res: Response) => {
    const { id } = req.body;
    try {
      const result = await Feedback.findByIdAndDelete(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

export default feedbackRoute;
