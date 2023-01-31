import { Document, Model } from "mongoose";
import { IUser, IUserSchema, UserDetailsType } from "../users/types";

export interface IFeedback {
  title: string;
  description: string;
  rate: number;
  creationDate: number;
  status: FeedbackStatusEnum;
}

export interface IFeedbackResponseData extends IFeedback {
  author: UserDetailsType;
}
export interface ICreateFeedbackRequest {
  title: string;
  description: string;
  rate: number;
}

export enum FeedbackStatusEnum {
  OPEN = 0,
  ACCEPTED = 10,
  REJECTED = 20,
}

export type FeedbackStatusesKeys = 0 | 10 | 20;

export interface IFeedbackSchema extends IFeedback, Document {
  authorId: string;
  getFeedbackAuthor: (this: IFeedbackSchema) => Promise<UserDetailsType | null>;
}

export interface IFeedbackModelMethods {
  findByStatus: (
    this: IFeedbackModel,
    status: FeedbackStatusesKeys
  ) => Promise<IFeedbackSchema[]>;
  modifyFeedbackStatus: (
    this: IFeedbackModel,
    id: string,
    status: FeedbackStatusesKeys
  ) => Promise<IFeedbackSchema>;
}

export interface IFeedbackModel
  extends Model<IFeedbackSchema, any, IFeedbackModelMethods> {
  findByStatus: (
    this: IFeedbackModel,
    status: FeedbackStatusesKeys
  ) => Promise<IFeedbackSchema[]>;
  modifyFeedbackStatus: (
    this: IFeedbackModel,
    id: string,
    status: FeedbackStatusEnum
  ) => Promise<IFeedbackSchema>;
}

export interface IFeedbackFilters {
  status: FeedbackStatusesKeys;
}
