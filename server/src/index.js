// Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const tokenManager = require("./scripts/tokenManager");
const validateTokenRouter = require("./routes/tokenValidation.js");
const authenticateRouter = require("./routes/authenticate.js");
const logoutRouter = require("./routes/logout.js");
const streamingRouter = require("./routes/streaming.js");
const path = require("path");
const fs = require("fs");
var cors = require("cors");
const https = require("https");
const socket = require("./routes/sockets");
const streamManager = require("./scripts/streamManager");

// Create server
var httpsServer = https.createServer(
  {
    key: fs.readFileSync("./src/certificates/key.pem"),
    cert: fs.readFileSync("./src/certificates/cert.pem"),
  },
  app
);

// Set up random crap
socket(httpsServer, app);
app.set("tokenManager", tokenManager);
app.set("streamManager", streamManager);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../../client", "build")));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Log requests to console
app.use((req, res, next) => {
  var date = new Date();
  date = date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  console.log(date, "PST: Request Incoming");
  next();
});

// Set up routes
app.use("/streaming", streamingRouter);
app.use("/authenticate", authenticateRouter);
app.use("/validateToken", validateTokenRouter);
app.use("/logout", logoutRouter);

// Catch all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// Start the server
httpsServer.listen(3001, () => console.log("Server started on port 3001"));
