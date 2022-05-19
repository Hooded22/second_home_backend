import {
  Schema,
  model,
  PreSaveMiddlewareFunction,
  Model,
  Document,
} from "mongoose";
import { IUserSchema } from "../types/userTypes";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUserSchema>({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

const User = model<IUserSchema>("UserModel", userSchema);

userSchema.pre<IUserSchema>("save", async function (next: any) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  //Hash password

  user.password = await bcrypt.hash(this.password, 12);
  next();
});

export default User;
