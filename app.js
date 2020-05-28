const logger = require('./logger');
const database = require('./private/db');
const express = require('express');
const path = require('path');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');

var app = express();

app.listen(3000, () => {
    logger.log('listening at 3000');
});

/*GET EJS WORKING */
//app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views')); // set views root directory, your .html
app.set('view engine', 'ejs');
app.engine('.html', ejs.renderFile); // register .html as an engine in express view system
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));  

//redirect to index.ejs 
app.get('/', (req, res) => {
    logger.log('we in here');
    res.render('admin');
});


//joke of the day endpoint
app.get('/api/v1/joke_of_the_day/:category', (req, res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    const category = req.params.category;
    const endpoint = 'https://api.jokes.one/jod?category='+category;

    request(endpoint, ip, (err, response, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(body));

        logger.insert(ip, endpoint, JSON.stringify(body));
    });
});
