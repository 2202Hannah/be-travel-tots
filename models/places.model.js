const db = require(`../db/connection`);

exports.selectPlaceById = place_id => {

  return db
    .query(
      `SELECT place_id, name, type_of_place, location, address FROM places WHERE place_id = $1;`,
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
