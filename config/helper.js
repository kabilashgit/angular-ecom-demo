const mysqli = require('mysqli');

let conn = new mysqli({
  host: 'localhost',
  port: 3306,
  user: 'admin',  //username
  passwd: '123456',  //password
  db: 'angular_ecom_db',
});

let db = conn.emit(false, '');

module.exports = {
  database: db
};
