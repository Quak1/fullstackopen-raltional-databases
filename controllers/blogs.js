const router = require("express").Router();

const { Blog } = require("../models");

const getBlog = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

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

router.delete("/:id", getBlog, async (req, res) => {
  if (req.blog) {
    try {
      await req.blog.destroy();
      res.sendStatus(200);
    } catch (e) {
      return res.status(400).json(e);
    }
  } else {
    res.sendStatus(404);
  }
});

router.put("/:id", getBlog, async (req, res) => {
  const { blog } = req;
  const { likes } = req.body;

  if (blog) {
    blog.likes = likes;
    try {
      await blog.save();
      res.json({ likes: blog.likes });
    } catch (e) {
      res.status(400).json(e);
    }
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
