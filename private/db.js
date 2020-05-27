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
            return;
        }
        callback(rs);   
    });
};

let insert = (username, password, callback) => {
    var sql = "INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "')";
    pool.query(sql, (err, rs) => {
        if (err) {
            logger('Error in insert db.js ' + err);
            callback(-1);
            return;
        }
        callback(rs);
    });
};

let updatePassword = (username, password, callback) => {
    var sql = "UPDATE users SET password='" + password + "' WHERE username='" + username + "'";
    pool.query(sql, (err, rs) => {
        if (err) {
            logger('Error in update db.js ' + err);
            callback(-1);
            return;
        }
        if (rs.affectedRows === 0) {
            logger(username + " does not exist in the database. Inserted instead of updated.");
            this.insert(username, password, (cb) => {
                if (cb == -1) {
                    logger("Sorry, we attempted to insert the user but failed.");
                }
            });
        }
        callback(rs);
    })
}

module.exports.insert = insert;
module.exports.query = query;
module.exports.update = updatePassword;