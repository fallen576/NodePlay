const mysql = require('mysql');
const logger = require('../logger');

let pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user : "node_user",
    password : "",/*DUMB SCHOOL PASSWORD GOES HERE*/
    database : 'node'
});

let query = (username, callback) => {
    var sql = "SELECT * FROM users WHERE username='" + username + "';";
    pool.query(sql, (err, rs) => {
        if (err) {
            logger('Error in query db.js ' + err);
            callback(-1);
        }
        
        callback(rs);   
    });
};

let insert = (username, password) => {
    var sql = "INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "')";
    pool.query(sql, (err, rs) => {
        if (err) {
            logger('Error in insert db.js ' + err);
            return -1;
        }
        else {
            return rs; 
        }
    });
};

let updatePassword = (username, password) => {
    var sql = "UPDATE users SET password='" + password + "' WHERE username='" + username + "')";
    pool.query(sql, (err, rs) => {
        if (err) {
            logger('Error in update db.js');
            return -1;
        }
        else {
            return rs;
        }
    })
}

module.exports.insert = insert;
module.exports.query = query;
module.exports.update = updatePassword;