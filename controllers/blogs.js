const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("./middleware");

const getBlog = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

// Show all blogs
router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search,
        },
      },
      {
        author: {
          [Op.substring]: req.query.search,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
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
