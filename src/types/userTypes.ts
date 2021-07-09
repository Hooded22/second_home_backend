import { Document } from "mongoose";


export type UserDetailsType = {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUser extends UserDetailsType {
  password: string;
};

export interface IUserSchema extends IUser, Document {
  userName: string;
  token?: string;
}

export type UserLoginType = {
  email: string;
  password: string;
}
