const { selectTypes } = require(`../models/types.model`);

exports.getTypes = (request, response, next) => {
  selectTypes()
    .then(types => {
      response.status(200).send({ types });
    })
    .catch(err => {
      next(err);
    });
};
