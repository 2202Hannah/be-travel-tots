const db = require(`../db/connection`);

exports.selectPlaceById = place_id => {
  return db
    .query(
      `SELECT p.place_id, p.name, p.type_of_place, p.location, p.address, COUNT(review_id) ::INT AS review_count, AVG(rating) ::INT AS review_average 
      FROM places p
      LEFT JOIN reviews r ON p.place_id = r.place_id 
      WHERE p.place_id = $1 
      GROUP BY p.place_id;`,
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

exports.updatePlaceVotes = (place_id, votes = 0) => {
  
  return db
    .query(
      `UPDATE places SET votes = votes + $1 WHERE place_id = $2 RETURNING *`,
      [votes, place_id]
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