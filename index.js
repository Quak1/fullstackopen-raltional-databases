require("dotenv").config();
const express = require("express");
const { Sequelize, QueryTypes, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "blog",
    underscored: true,
    timestamps: false,
  }
);

const app = express();
app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port", PORT));
