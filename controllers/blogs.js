const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");
const { Blog, User } = require("../models");

const getBlog = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: "token invalid" });
    }
  } else {
    res.status(401).json({ error: "token missing" });
  }
  next();
};

// Show all blogs
router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(blogs);
});

// Create new blog
router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

// Delete a blog
router.delete("/:id", getBlog, tokenExtractor, async (req, res) => {
  if (req.blog) {
    if (req.blog.userId === req.decodedToken.id) {
      await req.blog.destroy();
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(404);
  }
});

// Edit likes in a blog
router.put("/:id", getBlog, async (req, res) => {
  const { blog } = req;
  const { likes } = req.body;

  if (blog) {
    blog.likes = likes;
    await blog.save();
    res.json({ likes: blog.likes });
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
