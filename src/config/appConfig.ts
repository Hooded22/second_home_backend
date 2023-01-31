import { AccessControl } from "accesscontrol";
import User from "../users/userModel";
import { UserRoles } from "../users/userTypes";

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
  .read("reservation")
  .grant(UserRoles.MANAGER)
  .extend(UserRoles.STUFF)
  .create("room")
  .update("stuffPermissions");

export default appConfig;
