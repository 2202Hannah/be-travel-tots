const { selectPlaceById, updatePlaceVotes } = require(`../models/places.model`);

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
