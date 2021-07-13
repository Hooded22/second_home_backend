import { Document, Model } from "mongoose";
import { IUser, IUserSchema, UserDetailsType } from "./userTypes";

export interface IFeedback {
    title: string;
    description: string;
    rate: number;
    creationDate: number;
    status: FeedbackStatusesKeys;
}

export interface IFeedbackResponseData extends IFeedback {
    author: UserDetailsType;
}
export interface ICreateFeedbackRequest {
    title: string;
    description: string;
    rate: number;
}

export type FeedbackStatusesKeys = 0 | 10 | 20;

export interface IFeedbackSchema extends IFeedback, Document {
    authorId: string;
    getFeedbackAuthor: (this: IFeedbackSchema) => Promise<UserDetailsType | null>;
}

export interface IFeedbackModelMethods {
    findByStatus: (this: IFeedbackModel, status: FeedbackStatusesKeys) => Promise<IFeedbackSchema[]>;
}

export interface IFeedbackModel extends Model<IFeedbackSchema, any, IFeedbackModelMethods> {
    findByStatus: (this: IFeedbackModel, status: FeedbackStatusesKeys) => Promise<IFeedbackSchema[]>;
}
