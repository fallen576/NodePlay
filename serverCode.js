const logger = require('./logger');
const database = require('./private/db');
const express = require('express');
const bodyParser = require('body-parser');
const q = require('q');
var app = express();
var router = express.Router();

app.listen(3000, () => {
    logger('listening at 3000');
});

app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use('/', router);

router.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    if (username != "" && password != "") {
        //check if user exists  
             
        database.query(username, (data) => {
            if (data == -1) {
                logger("unable to connect");
            } else if (data == "") {
                logger("user inserted");
                database.insert(username, password);
            }
        });
        
    }
    
    return res.redirect('/index.html');
});