const mysqli = require('mysqli');

let conn = new mysqli({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,  //username
  passwd: process.env.DB_PASSWORD,  //password
  db: process.env.DB_DATABASE,
});

let db = conn.emit(false, '');

module.exports = {
  database: db
};
