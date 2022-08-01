const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByPk(id);

  if (blog) {
    try {
      await blog.destroy();
      res.sendStatus(200);
    } catch (e) {
      return res.status(400).json(e);
    }
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
