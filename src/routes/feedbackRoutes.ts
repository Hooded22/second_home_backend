import { Router, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import { validateAddFeedbackData } from "../controllers/feedbackControllers";
import Feedback from "../models/feedbackModel";
import {
    ICreateFeedbackRequest,
    IFeedbackFilters,
    IFeedbackResponseData,
} from "../types/feedbackTypes";
import { ResponseLocalsType } from "./requestTypes";
import auth from "./verifyToken";

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

feedbackRoute.get("/", async (req: Request<any, any, any, IFeedbackFilters>, res: Response) => {
    const { status } = req.query;
    try {
        if (status) {
            const users = await Feedback.findByStatus(status)
            return res.status(200).json(users);
        }
        const users = await Feedback.findByStatus(status)
        return res.status(200).json(users);
    } catch (error) {
        return res.send(400).send(error);
    }
}
);

feedbackRoute.post('/confirmFeedback', async (req: Request<any, any, { id: string }>, res: Response) => {
    const { id } = req.body;
    try {
        const result = await Feedback.modifyFeedbackStatus(id, 10);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).send(error)
    }
})

export default feedbackRoute;
