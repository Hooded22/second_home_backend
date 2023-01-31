import Feedback from "./model";
import User from "../users/model";
import { FeedbackStatusesKeys, IFeedbackSchema } from "./types";
import { UserDetailsType } from "../users/types";

export async function getFeedbackAuthor(
  this: IFeedbackSchema
): Promise<UserDetailsType | null> {
  const user = await User.findOne({ _id: this.authorId });
  if (user) {
    const { firstName, lastName, email } = user;
    return {
      firstName,
      lastName,
      email,
    };
  }
  return null;
}
