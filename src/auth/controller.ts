import { hash } from "bcrypt";
import User from "../users/model";
import { IUser, UserDetailsType, IUserSchema } from "../users/types";
import { Secret, sign } from "jsonwebtoken";
import config from "../config/appConfig";

export class AuthController {
  async saveUserToken(token: string, userId: string) {
    return await User.findOneAndUpdate({ _id: userId }, { token });
  }

  async registerUser(userData: IUser) {
    const { password, firstName, lastName } = userData;
    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      ...userData,
      userName: `${firstName} ${lastName}`,
      password: hashedPassword,
    });
    try {
      const result = await newUser.save();
      return result;
    } catch (error: any) {
      throw new Error(error).message;
    }
  }

  async loginUser(user: IUserSchema) {
    const tokenSecret: Secret = config.TOKEN_SECRET;
    const { firstName, lastName, email, _id, role } = user;
    const token = sign({ _id: user._id, role: user.role }, tokenSecret);
    const userDetails: UserDetailsType = {
      _id,
      firstName,
      lastName,
      email,
      role,
    };
    await this.saveUserToken(token, _id);
    return {
      token,
      userDetails,
    };
  }
}
