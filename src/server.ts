import express from "express";
import { Server } from "http";
import mongoose from "mongoose";

const app = express();

let server: Server;
const port = process.env.PORT as string;
const dbUri = process.env.MDB_URI as string;
const startServer = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log(`MongoDB connected successfully`);
    server = app.listen(port, () => {
      console.log(`WS-Parselly server running on ${port} port`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
