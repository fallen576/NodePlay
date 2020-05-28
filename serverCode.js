const logger = require('./logger');
const database = require('./private/db');
const express = require('express');
const path = require('path');
let ejs = require('ejs');
const bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.listen(3000, () => {
    logger.log('listening at 3000');
});

/*GET EJS WORKING */
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views')); // set views root directory, your .html
app.set('view engine', 'ejs');
app.engine('.html', ejs.renderFile); // register .html as an engine in express view system


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));  

app.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    if (username != "" && password != "") {
        if (req.body.method == "insert") {
            insert(username, password);
        } else if (req.body.method == "update") {
            update(username, password);
        }
    }
    
   // return res.redirect('/index.html');
   res.render("index.ejs", {"username":username});
});

var insert = (username, password) => {
    database.query(username, (data) => {
        logger.log(data);
        if (data == -1) {
            logger.log("unable to connect");
        } else if (data == "") {
            logger.log("user inserted");
            database.insert(username, password);
            return;
        }
        else {
            logger.log('Found user in database. Username is ' + data[0].username);
        }
    });
};

var update = (username, password) => {

    database.update(username, password, (data) => {
        if (data == -1) {
            logger.log("unable to connect");
        } else if (data == "") {
            logger.log("user inserted");
            database.insert(username, password);
        } else {
            logger.log("user has been updated.");
        }
    });
};