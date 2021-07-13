import User from "../models/userModel";
import { IFeedbackSchema } from "../types/feedbackTypes";
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