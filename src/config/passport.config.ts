import passport, { PassportStatic } from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import User from "../users/userModel";
import bcrypt from "bcrypt";

export function initialize(passport: PassportStatic) {
  const localStrategy = new LocalStrategy(
    { usernameField: "email" },
    async (
      username: string,
      password: string,
      done: (error: any, user?: any, options?: IVerifyOptions) => void
    ) => {
      try {
        const user = await User.findOne({ email: username });
        if (user) {
          const passwordCorrect = await bcrypt.compare(password, user.password);
          passwordCorrect
            ? done(null, user)
            : done(null, false, { message: "Incorrect password" });
        } else {
          done(null, false, { message: "Incorrect email or password" });
        }
      } catch (error) {
        done(null, false, { message: "Error" });
      }
    }
  );

  passport.use("local", localStrategy);
}
