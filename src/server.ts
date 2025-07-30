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

// Unhandled rejection error
process.on("unhandledRejection", (error) => {
  console.log("Unhandled rejection detected ... Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
// uncaught rejection error
process.on("uncaughtException", (error) => {
  console.log("Unhandled rejection detected ... Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Signal rejection error
process.on("SIGTERM", (error) => {
  console.log("SIGTERM receive detected ... Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", (err) => {
  console.log("SIGINT receive detected ... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

(async () => {
  startServer();
})();
