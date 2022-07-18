const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("/tokenValidation");
  const reqToken = req.headers.auth;
  const username = req.body.user.toLowerCase();
  const storedTokens = req.app.get("tokenManager").getTokens(username);
  if (!storedTokens || !storedTokens.has(reqToken)) {
    res.status(201).json({ status: false });
  } else {
    res.status(201).json({ status: true });
  }
});

module.exports = router;
