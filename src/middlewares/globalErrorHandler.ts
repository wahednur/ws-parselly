/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import AppError from "../app/errorHelpers/errorHelpers";

const globalErrorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: any = [];

  // Zod Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errorDetails = [{ path: err.path, message: "Invalid ObjectId" }];
  }

  // Mongoose ValidationError
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Mongoose Validation Error";
    errorDetails = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message,
    }));
  }

  // Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate Key Error";
    const duplicateField = Object.keys(err.keyValue || {})[0];
    errorDetails = [
      {
        path: duplicateField,
        message: `${duplicateField} must be unique`,
      },
    ];
  }

  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [];
  }

  // Fallback
  else {
    message = err.message || message;
    errorDetails = [];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
