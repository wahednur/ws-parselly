import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
type AnyZodObject = ZodObject<ZodRawShape>;

export const validateRequest = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (typeof req.body?.data === "string") {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (jsonError) {
          return res.status(400).json({
            message: "Invalid JSON format in 'data'",
            error: jsonError,
          });
        }
      }
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Zod validation failed",
        error,
      });
    }
  };
};
