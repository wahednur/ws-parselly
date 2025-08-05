import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import "./app/configs/passport";
import { router } from "./app/routes/index";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Express Session
app.use(
  expressSession({
    secret: "Your secrete",
    resave: false,
    saveUninitialized: false,
  })
);
//Passport initialize
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to WS Parselly",
  });
});
app.use(globalErrorHandler);
export default app;
