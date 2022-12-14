import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("/logout");

  const reqToken = req.headers.auth;
  const username = req.body.user.toLowerCase();
  const userTokens = req.app.get("tokenManager").getTokens(username);
  if (userTokens && userTokens.has(reqToken)) {
    req.app.get("tokenManager").removeToken(username, reqToken);
    res.status(201).json({ status: "ok" });
  } else {
    res.status(201).json({ status: "ok" });
  }
});

export default router;
