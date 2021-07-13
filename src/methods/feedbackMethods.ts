import User from "../models/userModel";
import { IFeedbackSchema } from "../types/feedbackTypes";
import { IUserSchema } from "../types/userTypes";

export async function getFeedbackAuthor(this: IFeedbackSchema): Promise<IUserSchema | null> {
    const user = await User.findOne({ _id: this.authorId });
    return user;
}