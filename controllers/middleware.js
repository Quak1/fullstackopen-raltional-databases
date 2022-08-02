const errorHandler = (error, _request, response, next) => {
  console.error("errorHandler:", error.name, "|", error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: error.message });
  } else {
    return response.status(500).send({ error: "unkown error" });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
