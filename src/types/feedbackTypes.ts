import { Document, Model } from "mongoose";
import { IUserSchema } from "./userTypes";

export interface IFeedback {
    title: string;
    description: string;
    rate: number;
    authorId: number;
    creationDate: number;
    status: FeedbackStatusesKeys;
}

export type FeedbackStatusesKeys = 0 | 10 | 20;

export interface IFeedbackSchema extends IFeedback, Document {
    getFeedbackAuthor: (this: IFeedbackSchema) => Promise<IUserSchema | null>;
}

export interface IFeedbackModelMethods {
    findByStatus: (this: IFeedbackModel, status: FeedbackStatusesKeys) => Promise<IFeedbackSchema[]>;
}

export interface IFeedbackModel extends Model<IFeedbackSchema, any, IFeedbackModelMethods> {
    findByStatus: (this: IFeedbackModel, status: FeedbackStatusesKeys) => Promise<IFeedbackSchema[]>;
}
