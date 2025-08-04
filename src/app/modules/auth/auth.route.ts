import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../configs/env";
import { AuthControllers } from "./auth.controller";

const router = Router();
router.post("/login", AuthControllers.credentialsLogin);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with our support team`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
