import Feedback from "../models/feedbackModel";
import User from "../models/userModel";
import { FeedbackStatusesKeys, IFeedbackSchema } from "../types/feedbackTypes";
import { UserDetailsType } from "../types/userTypes";

export async function getFeedbackAuthor(this: IFeedbackSchema): Promise<UserDetailsType | null> {
    const user = await User.findOne({ _id: this.authorId });
    if (user) {
        const { firstName, lastName, email } = user;
        return {
            firstName,
            lastName,
            email
        }
    }
    return null;
}

