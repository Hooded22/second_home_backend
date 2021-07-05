import {
  Schema,
  model,
  PreSaveMiddlewareFunction,
  Model,
  Document,
} from "mongoose";
import { IUserSchema } from "../types/userTypes";

interface IUser extends Document, IUserSchema {}

const userSchema = new Schema<IUser>({
  name: { type: String, require: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
});

const User = model<IUserSchema>("UserModel", userSchema);

userSchema.pre<IUser>("save", function (next: any) {
  const user = this;
});

export default User;
