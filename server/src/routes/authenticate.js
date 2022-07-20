import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import data from "../certificates/users.js";

var rand = function () {
  return Math.random().toString(36).substr(2);
};

var token = function () {
  return rand() + rand() + rand() + rand();
};

const authenticate = async (req) => {
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

router.post("/", async (req, res) => {
  console.log("/authenticate");
  const passed = await authenticate(req);
  if (!passed) {
    res.status(404).json({ status: "you suck" });
  } else {
    const myToken = token();
    const username = req.body.username.toLowerCase();
    req.app.get("tokenManager").setToken(username, myToken);
    req.app.get("streamManager").addUser(username);
    res.status(201).json({ token: myToken, status: "ok" });
  }
});

export default router;
