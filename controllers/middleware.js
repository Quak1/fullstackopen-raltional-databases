const errorHandler = (error, _request, response, next) => {
  console.error("errorHandler:", error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: "malformatted body" });
  } else {
    return response.status(500).send({ error: "unkown error" });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
