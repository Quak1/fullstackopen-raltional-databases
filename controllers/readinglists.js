const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");
const { tokenExtractor } = require("./middleware");

// add to reading list
router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;

  const user = await User.findByPk(userId);
  const blog = await Blog.findByPk(blogId);

  const reading = await user.addReading_blog(blog);

  res.json(reading);
});

// mark as read
router.put("/:id", tokenExtractor, async (req, res) => {
  const { read } = req.body;
  const { id } = req.params;

  const entry = await ReadingList.findByPk(id);
  if (req.decodedToken.id === entry.userId) {
    entry.isRead = read;
    const saved = await entry.save();
    res.json(saved);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
