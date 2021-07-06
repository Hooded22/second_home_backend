import {
  Schema,
  model,
  PreSaveMiddlewareFunction,
  Model,
  Document,
} from "mongoose";
import { IUserSchema } from "../types/userTypes";
import bcrypt from "bcrypt";

interface IUser extends Document, IUserSchema {}

const userSchema = new Schema<IUser>({
  name: { type: String, require: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
  password: String,
});

const User = model<IUserSchema>("UserModel", userSchema);

userSchema.pre<IUser>("save", async function (next: any) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  //Hash password
  user.password = await bcrypt.hash(this.password, 12);
  next();
});

export default User;
