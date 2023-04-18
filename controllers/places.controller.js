const { selectPlaceById } = require(`../models/places.model`);

exports.getPlaceById = (request, response, next) => {
  const { place_id } = request.params;

  selectPlaceById(place_id)
    .then(place => {
      response.status(200).send({ place });
    })
    .catch(err => {
      next(err);
    });
};
