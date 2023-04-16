const format = require("pg-format");
const db = require("../connection");

const seed = async ({ userData }) => {
  await db.query(`DROP TABLE IF EXISTS users`);

  const usersTablePromise = db.query(`
    CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        password VARCHAR
    );`);

  await Promise.all([usersTablePromise]);

  const insertUsersQueryStr = format(
    "INSERT INTO users (username, name, password) VALUES %L RETURNING *;",
    userData.map(({ username, name, password }) => [username, name, password])
  );
  const usersPromise = db.query(insertUsersQueryStr).then(result => result.rows);

  await Promise.all([usersPromise]);
};

module.exports = seed;
