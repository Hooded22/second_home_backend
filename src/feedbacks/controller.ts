import errorMessages from "../assets/errorMessages";
import Feedback from "./model";
import {
  FeedbackStatusEnum,
  ICreateFeedbackRequest,
  IFeedback,
  IFeedbackResponseData,
} from "./types";

export default class FeedbackController {
  async addFeedback(
    feedback: ICreateFeedbackRequest,
    user: Express.User | undefined
  ) {
    const feedbackToAdd = new Feedback({
      ...feedback,
      authorId: user?._id,
    });

    try {
      const result = await feedbackToAdd.save();
      const { title, description, rate, creationDate, status } = result;
      const author = await result.getFeedbackAuthor();

      if (!author) {
        throw new Error(errorMessages.userNotFound);
      }

      const resultData: IFeedbackResponseData = {
        title,
        description,
        rate,
        creationDate,
        status,
        author,
      };

      return resultData;
    } catch (error) {
      throw new Error(error ? (error as any) : errorMessages.internalError);
    }
  }

  async getFeedback(status?: IFeedback["status"]) {
    try {
      const feedbacks = status
        ? await Feedback.findByStatus(status)
        : await Feedback.find();
      return feedbacks;
    } catch (error) {
      throw new Error(errorMessages.findError);
    }
  }

  async confirmFeedback(id: string) {
    try {
      const result = await Feedback.modifyFeedbackStatus(
        id,
        FeedbackStatusEnum.ACCEPTED
      );
      return result;
    } catch (error) {
      throw new Error("Operatioj failure");
    }
  }

  async rejectFeedback(id: string) {
    try {
      const result = await Feedback.modifyFeedbackStatus(
        id,
        FeedbackStatusEnum.REJECTED
      );
      return result;
    } catch (error) {
      throw new Error("Operatioj failure");
    }
  }

  async deleteFeedback(id: string) {
    try {
      const result = await Feedback.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new Error("Operatioj failure");
    }
  }
}
