import { AccessControl } from "accesscontrol";
import User from "../models/userModel";
import { UserRoles } from "../types/userTypes";

const appConfig = {
  TOKEN_SECRET: "asdcvbhjklop",
};

export const ac = new AccessControl();

ac.grant(UserRoles.CUSTOMER)
  .grant(UserRoles.STUFF)
  .extend(UserRoles.CUSTOMER)
  .update("feedback")
  .create("customer")
  .update("customer")
  .create("reservation")
  .update("reservation")
  .grant(UserRoles.MANAGER)
  .extend(UserRoles.STUFF)
  .create("room")
  .update("stuffPermissions");

export default appConfig;
