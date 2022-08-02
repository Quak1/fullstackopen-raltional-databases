const router = require("express").Router();

const { User } = require("../models");

// Get all user
router.get("/", async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Create new user
router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Edit username by username
router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const newUsername = req.body.username;
  const user = await User.findOne({ where: { username } });

  if (user) {
    user.username = newUsername;
    await user.save();
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
