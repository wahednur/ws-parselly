import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, Role } from "../modules/users/user.interface";
import { User } from "../modules/users/user.model";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        const existUser = await User.findOne({ email });
        if (!existUser) {
          return done("User does not exist");
        }
        if (!existUser.isVerified) {
          return done("User not verified, please verify now");
        }
        if (
          existUser &&
          (existUser.isActive === IsActive.INACTIVE ||
            existUser.isActive === IsActive.BLOCKED)
        ) {
          return done(`User is ${existUser.isActive}`);
        }
        if (existUser.isDeleted) {
          return done("User is Deleted");
        }
        const googleAuthenticated = existUser.auths.some(
          (providerObj) => providerObj.provider === "google"
        );
        if (googleAuthenticated && !existUser.password) {
          return done(null, false, {
            message:
              "You have authenticated with google login. If you want to login with credentials login then at first login with google then set password",
          });
        }
        const passMatched = await bcrypt.compare(
          password as string,
          existUser.password as string
        );
        if (!passMatched) {
          return done("password does not match");
        }
        return done(null, existUser);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }
        let existUser = await User.findOne({ email });
        if (existUser && !existUser.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }
        if (
          existUser &&
          (existUser.isActive === IsActive.BLOCKED ||
            existUser.isActive === IsActive.INACTIVE)
        ) {
          return done(`User is ${existUser.isActive}`);
        }
        if (!existUser) {
          existUser = await User.create({
            email,
            name: profile.displayName,
            photo: profile?.photos?.[0].value,
            role: Role.USER,
            isVerify: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, existUser);
      } catch (error) {
        console.log("Google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user?._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});
