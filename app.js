const express = require("express");
const app = express();
const { getTypes } = require(`./controllers/types.controller.js`);

app.use(express.json());

app.get(`/api/types`, getTypes);

app.all("/*", (request, response) => {
    response.status(404).send({ msg: "Route not found" });
  });

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Something went wrong!" });
});

module.exports = app;
