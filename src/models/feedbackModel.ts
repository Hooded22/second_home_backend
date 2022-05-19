import { Schema, model } from "mongoose";
import { getFeedbackAuthor } from "../methods/feedbackMethods";
import { findByStatus, modifyFeedbackStatus } from "../static/feedbackStatic";
import { IFeedbackModel, IFeedbackSchema } from "../types/feedbackTypes";

const FeedbackSchema = new Schema<IFeedbackSchema, IFeedbackModel>({
  title: String,
  description: { type: String, required: false },
  rate: Number,
  creationDate: { type: Date, require: false, default: new Date() },
  authorId: String,
  status: { type: Number, require: false, default: 0 },
});

FeedbackSchema.static("findByStatus", findByStatus);
FeedbackSchema.methods.getFeedbackAuthor = getFeedbackAuthor;
FeedbackSchema.static("modifyFeedbackStatus", modifyFeedbackStatus);

const Feedback = model<IFeedbackSchema, IFeedbackModel>(
  "Feedback",
  FeedbackSchema
);

export default Feedback;
