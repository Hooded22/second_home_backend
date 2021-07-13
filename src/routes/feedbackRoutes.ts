import { Router, Request, Response } from 'express';
import Feedback from '../models/feedbackModel';
import { ICreateFeedbackRequest, IFeedbackResponseData } from '../types/feedbackTypes';
import { ResponseLocalsType } from './requestTypes';
import auth from './verifyToken';

const feedbackRoute = Router();

feedbackRoute.use('/', auth);

feedbackRoute.post('/', async (req: Request<any, any, ICreateFeedbackRequest>, res: Response<any, ResponseLocalsType>) => {
    const author = res.locals.user;
    const feedback = new Feedback({
        ...req.body,
        authorId: author?._id,
    });
    try {
        const result = await feedback.save();
        const { title, description, rate, creationDate, status } = result;
        const feedbackAuthor = await result.getFeedbackAuthor();
        if (!feedbackAuthor) return res.status(404).send("Author not found");
        const { firstName, lastName, email } = feedbackAuthor;
        const resultData: IFeedbackResponseData = {
            title,
            description,
            rate,
            creationDate,
            status,
            author: {
                firstName,
                lastName,
                email
            }
        }
        res.status(200).json(resultData);
    } catch (error) {
        res.status(400).json(error);
    }
})

export default feedbackRoute;