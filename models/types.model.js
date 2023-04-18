const db = require(`../db/connection`);

exports.selectTypes = () => {
  return db.query(`SELECT * FROM typeOfPlace`).then(({ rows }) => {
    return rows;
  });
};