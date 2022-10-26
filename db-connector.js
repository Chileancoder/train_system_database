// Mysql connection module, must update to your own credentials.

var mysql = require('mysql');  // Create instance of mysql for app.

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_gajardos',
  password        : '8975',
  database        : 'cs340_gajardos',
  dateStrings     : 'date'  // Changes dates to string which allows for display without timestamp.
});

module.exports.pool = pool;  // Export module for use in app.
