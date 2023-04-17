const format = require("pg-format");
const db = require("../connection");

const seed = async ({
  typeOfPlaceData,
  userData,
  childrenData,
  placesData,
  reviewsData
}) => {
  await db.query(`DROP TABLE IF EXISTS reviews`);
  await db.query(`DROP TABLE IF EXISTS places`);
  await db.query(`DROP TABLE IF EXISTS children`);
  //await db.query(`DROP TABLE IF EXISTS amenities`);
  await db.query(`DROP TABLE IF EXISTS typeOfPlace`);
  await db.query(`DROP TABLE IF EXISTS users`);

  const typeOfPlaceTablePromise = db.query(`
CREATE TABLE typeOfPlace (
  slug VARCHAR PRIMARY KEY,
  description VARCHAR
);`);

  const usersTablePromise = db.query(`
    CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR,
        password VARCHAR,
        profile_pic VARCHAR,
        hometown VARCHAR
    );`);

  // const amenityTablePromise = db.query(`
  // CREATE TABLE amenities (

  // )`)

  await Promise.all([typeOfPlaceTablePromise, usersTablePromise]);

  const childrenTablePromise = db.query(`
  CREATE TABLE children (
    child_id SERIAL PRIMARY KEY,
    parent_id VARCHAR NOT NULL REFERENCES users(username),
    child_dob DATE NOT NULL
  );`);

  const placesTablePromise = db.query(`
  CREATE TABLE places (
    place_id SERIAL PRIMARY KEY, 
    name VARCHAR NOT NULL,
    type_of_place VARCHAR NOT NULL REFERENCES typeOfPlace(slug),
    location VARCHAR,
    address VARCHAR,
    overall_rating INT
  )`);

  await Promise.all([childrenTablePromise, placesTablePromise]);

  await db.query(`
  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    place_id INT NOT NULL REFERENCES places(place_id),
    rating INT,
    review_text VARCHAR, 
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  const insertTypeOfPlaceString = format(
    "INSERT INTO typeOfPlace (slug, description) VALUES %L RETURNING *;",
    typeOfPlaceData.map(({ slug, description }) => [slug, description])
  );
  const typeOfPlacePromise = db
    .query(insertTypeOfPlaceString)
    .then(result => result.rows);

  const insertUsersQueryStr = format(
    "INSERT INTO users (username, name, email, password, profile_pic, hometown) VALUES %L RETURNING *;",
    userData.map(
      ({ username, name, email, password, profile_pic, hometown }) => [
        username,
        name,
        email,
        password,
        profile_pic,
        hometown
      ]
    )
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then(result => result.rows);

  await Promise.all([typeOfPlacePromise, usersPromise]);

  const insertChildrenQueryStr = format(
    "INSERT INTO children (child_id, parent_id, child_dob) VALUES %L RETURNING *;",
    childrenData.map(({ child_id, parent_id, child_dob }) => [
      child_id,
      parent_id,
      child_dob
    ])
  );
  const childrenPromise = db
    .query(insertChildrenQueryStr)
    .then(result => result.rows);

  const insertPlacesQueryStr = format(
    "INSERT INTO places (place_id, name, type_of_place, location, address, overall_rating) VALUES %L RETURNING *;",
    placesData.map(
      ({
        place_id,
        name,
        type_of_place,
        location,
        address,
        overall_rating
      }) => [place_id, name, type_of_place, location, address, overall_rating]
    )
  );
  const placesPromise = db
    .query(insertPlacesQueryStr)
    .then(result => result.rows);

  await Promise.all([childrenPromise, placesPromise]);


// place ID look up function here (would be the createRef function)  
//format comments data here? would need a factory function. 

  const insertReviewsQueryStr = format(
    "INSERT INTO reviews (review_id, place_id, rating, review_text, created_at) VALUES %L RETURNING *;",
    reviewsData.map(({ review_id, place_id, rating, review_text, created_at }) => [
      review_id,
      place_id,
      rating,
      review_text,
      created_at
    ])
  );
  return db.query(insertReviewsQueryStr).then(result => result.rows);
};

module.exports = seed;
