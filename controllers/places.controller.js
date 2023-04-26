const { selectPlaceById, updatePlaceVotes, selectPlaces } = require(`../models/places.model`);

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

exports.patchPlaceVotesById = (request, response, next) => {
  const { place_id } = request.params;
  const { inc_votes: votes } = request.body;

  updatePlaceVotes(place_id, votes)
    .then(place => {
      response.status(200).send({ place });
    })
    .catch(err => {
      next(err);
    });
};

exports.getPlaces = (request, response, next) => {
  const typeFilter = request.query.type_of_place;

  selectPlaces(typeFilter)
    .then(places => {
      response.status(200).send({ places });
    })
    .catch(err => {
      next(err);
    });
};
