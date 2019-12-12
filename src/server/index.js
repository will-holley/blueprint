// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { router as restApiRouter, endpoint as restEndpoint } from "./rest";

// Environment Variables
const {
  SERVER_PORT: serverPort,
  CLIENT_PORT: clientPort,
  NODE_ENV: env
} = process.env;

// Setup App
const app = express();

// Add Middlewares
// Deny cross-origin requests
app.use(cors());

// Start HTTP Server
app.listen(serverPort, () => console.log(`Server listening on :${serverPort}`));

// Add REST API Routes
app.use(restEndpoint, restApiRouter);
