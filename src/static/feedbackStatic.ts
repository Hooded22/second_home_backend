import { FeedbackStatusesKeys, IFeedback, IFeedbackModel, IFeedbackSchema } from '../types/feedbackTypes';
import { IUserSchema } from '../types/userTypes';

export async function findByStatus(this: IFeedbackModel, status: FeedbackStatusesKeys): Promise<IFeedbackSchema[]> {
    const records = await this.find({ status: status });
    return records;
}