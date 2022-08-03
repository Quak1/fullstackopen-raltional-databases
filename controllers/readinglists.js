const router = require("express").Router();

const { Blog, User } = require("../models");

// add to reading list
router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;

  const user = await User.findByPk(userId);
  const blog = await Blog.findByPk(blogId);

  const reading = await user.addReading_blog(blog);

  res.json(reading);
});

module.exports = router;
