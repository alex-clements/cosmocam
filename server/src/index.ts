// Imports
import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
import bodyParser from "body-parser";
import tokenManager from "./scripts/tokenManager.js";
import validateTokenRouter from "./routes/tokenValidation.js";
import authenticateRouter from "./routes/authenticate.js";
import logoutRouter from "./routes/logout.js";
import streamingRouter from "./routes/streaming.js";
import path from "path";
import fs from "fs";
import cors from "cors";
import https from "https";
import socket from "./routes/sockets.js";
import StreamManager from "./scripts/streamManager/StreamManager.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server
var httpsServer = https.createServer(
  {
    key: fs.readFileSync("./src/certificates/key.pem"),
    cert: fs.readFileSync("./src/certificates/cert.pem"),
  },
  app
);

// Set up random crap
app.set("streamManager", new StreamManager());
app.set("tokenManager", tokenManager);
socket(httpsServer, app);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../../client", "build")));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Log requests to console
app.use((req: Request, res: Response, next: NextFunction) => {
  var date = new Date();
  let string_date: String = date.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  console.log("\n", string_date, "PST: Request Incoming");
  next();
});

// Set up routes
app.use("/streaming", streamingRouter);
app.use("/authenticate", authenticateRouter);
app.use("/validateToken", validateTokenRouter);
app.use("/logout", logoutRouter);

// Catch all
app.get("*", (req: Request, res: Response) => {
  console.log(path.join(__dirname, "../../client/build/index.html"));
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// Start the server
httpsServer.listen(3001, () => console.log("Server started on port 3001"));
