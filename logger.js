var db = require('./private/db');

var log = message => console.log(message);
var insert = (caller_ip, endpoint, message) => {
    let rs = db.insertLog(caller_ip, endpoint, message);
};

module.exports.log = log;
module.exports.insert = insert;