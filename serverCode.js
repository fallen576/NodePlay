const logger = require('./logger');
const database = require('./private/db');
const express = require('express');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const q = require('q');
var app = express();
var router = express.Router();

app.listen(3000, () => {
    logger('listening at 3000');
});

app.set('view engine', 'ejs');
app.set('views', __dirname +'\\public');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use('/', router);

router.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    if (username != "" && password != "") {
        if (req.body.method == "insert") {
            insert(username);
        } else if (req.body.method == "update") {
            update(username, password);
        }
    }
    
   // return res.redirect('/index.html');
   res.render("index.html", {"username":username});
});

var insert = (username) => {
    database.query(username, (data) => {
        logger(data);
        if (data == -1) {
            logger("unable to connect");
        } else if (data == "") {
            logger("user inserted");
            database.insert(username, password);
        }
        else {
            logger('Found user in database. Username is ' + data[0].username);
        }
    });
};

var update = (username, password) => {

    database.update(username, password, (data) => {
        if (data == -1) {
            logger("unable to connect");
        } else if (data == "") {
            logger("user inserted");
            database.insert(username, password);
        } else {
            logger("user has been updated.");
        }
    });
};