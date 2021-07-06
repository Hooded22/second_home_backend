import { Document } from "mongoose";

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface IUserSchema extends UserType {
  userName: string;
}
