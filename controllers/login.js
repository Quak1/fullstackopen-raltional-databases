const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");
const { User, ActiveSessions } = require("../models");

// Login user
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  const passwordCorrect = password === "password";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const userFortoken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userFortoken, SECRET);

  await ActiveSessions.create({ token });

  res.json({ token, username: user.username, name: user.name });
});

module.exports = router;
