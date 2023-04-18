const express = require("express");
const app = express();
const { getTypes } = require(`./controllers/types.controller`);
const { getPlaceById } = require(`./controllers/places.controller`);

app.use(express.json());

app.get(`/api/types`, getTypes);
app.get(`/api/places/:place_id`, getPlaceById);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Route not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response
      .status(400)
      .send({ msg: "You have made a bad request - invalid type" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
    if (err.status) {
      response.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Something went wrong!" });
});

module.exports = app;
