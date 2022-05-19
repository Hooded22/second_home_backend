import {
  FeedbackStatusesKeys,
  IFeedback,
  IFeedbackModel,
  IFeedbackSchema,
} from "../types/feedbackTypes";
import { IUserSchema } from "../types/userTypes";

export async function findByStatus(
  this: IFeedbackModel,
  status: FeedbackStatusesKeys
): Promise<IFeedbackSchema[]> {
  const records = await this.find({ status: status });
  return records;
}

export async function modifyFeedbackStatus(
  this: IFeedbackModel,
  id: string,
  status: FeedbackStatusesKeys
): Promise<IFeedbackSchema> {
  try {
    const result = await this.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );
    return result;
  } catch (error) {
    return error;
  }
}
