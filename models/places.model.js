const db = require(`../db/connection`);

exports.selectPlaceById = place_id => {
  
  return db
    .query(
      `SELECT places.place_id, name, type_of_place, location, address, COUNT(review_id) ::INT AS review_count FROM places LEFT JOIN reviews ON places.place_id = reviews.place_id WHERE places.place_id = $1 GROUP BY places.place_id;`,
      [place_id]
    )
    .then(({ rows }) => {
      if (rows.length === 1) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "place_id not found in the database"
        });
      }
    });
};
