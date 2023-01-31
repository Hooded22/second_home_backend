import { Request } from "express";
import { IUser, UserDetailsType } from "./src/users/userTypes";

declare global {
  namespace Express {
    export interface User {
      role: UserDetailsType["role"];
      _id: string;
    }
  }
}

export = Express;
