import express, { Request, Response } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to WS Parselly",
  });
});

export default app;
