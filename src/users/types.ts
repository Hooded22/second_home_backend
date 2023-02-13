import { Document } from "mongoose";

//TODO: Refactor: UserDetails -> IUser, IUserModel, UserCreateData, etc.

export type UserDetailsType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRoles;
};

export enum UserRoles {
  CUSTOMER = "user",
  STUFF = "stuff",
  MANAGER = "manager",
}

export interface IUser extends Omit<UserDetailsType, "_id"> {
  password: string;
}

export interface IUserSchema extends IUser, Document {
  userName: string;
  token?: string;
}

export type UserLoginType = {
  email: string;
  password: string;
};
