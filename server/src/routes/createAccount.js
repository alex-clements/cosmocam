import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

var rand = function () {
  return Math.random().toString(36).substr(2);
};

var token = function () {
  return rand() + rand() + rand() + rand();
};

const authenticate = async (req) => {
  let rawData = fs.readFileSync("../certificates/users.json");
  let data = JSON.parse(rawData);

  if (req.body.username.toLowerCase() in data) {
    const username = req.body.username.toLowerCase();
    const passwordHash = data[username]["password"];
    const match = await bcrypt.compare(req.body.password, passwordHash);
    if (match) {
      return true;
    }
  }
  return false;
};

router.post("/checkUsername", async (req, res) => {
  let rawData = fs.readFileSync("../certificates/users.json");
  let data = JSON.parse(rawData);

  if (req.body.username.toLowerCase() in data) {
    res.status(201).json({ status: "bad", username_taken: true });
  } else {
    res.status(201).json({ status: "ok", username_taken: false });
  }
});

router.post("/", async (req, res) => {
  console.log("/createAccount");
  const myToken = token();
  const username = req.body.username.toLowerCase();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let rawData = fs.readFileSync(
    path.join(__dirname, "../certificates/users.json")
  );
  let data = JSON.parse(rawData);

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  let password = await bcrypt.hash(req.body.password, salt);
  data[username] = { password: password };

  fs.writeFileSync(
    path.join(__dirname, "../certificates/users.json"),
    JSON.stringify(data)
  );

  req.app.get("tokenManager").setToken(username, myToken);
  req.app.get("streamManager").addUser(username);

  res.status(201).json({ token: myToken, status: "ok" });
});

export default router;
