const logger = require('./logger');
const database = require('./private/db');
const express = require('express');
const path = require('path');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.on('connection', socket => {
    //socket.emit('chat-message', 'hello world!');
    //logger.log('connected');
})

/*GET EJS WORKING */
//app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views')); // set views root directory, your .html
app.set('view engine', 'ejs');
app.engine('.html', ejs.renderFile); // register .html as an engine in express view system
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));  

//redirect to index.ejs 
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/admin', (req, res) => {
    database.getLogs(res, (cb) => {
        var logObjectArr = [];
        for (var i in cb) {
            var tmp = cb[i];
            //logger.log(tmp.id + " " + tmp.message + " " + tmp.caller_ip + " " + tmp.endpoint);
            var logObject = {
                "id" : tmp.id,
                "message" : tmp.message,
                "caller_ip" : tmp.caller_ip,
                "endpoint" : tmp.endpoint
            };
            logObjectArr.push(logObject);
        }
        res.render('admin', {"logList":logObjectArr});
    });
});

//joke of the day endpoint
app.get('/api/v1/joke_of_the_day/:category', (req, res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    const category = req.params.category;
    var endpoint = 'https://api.jokes.one/jod?category='+category;
    //endpoint = "";
    request(endpoint, ip, (err, response, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(body));

        logger.insert(ip, endpoint, JSON.stringify(body));
        var obj = {'ip':ip,'endpoint':endpoint,'body':body};

        io.emit("message-logged", obj);
        logger.log('emitting');
    });
});

//brews
app.get('/api/v1/brews/:state', (req,res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    const state = req.params.state;
    var endpoint = 'https://api.openbrewerydb.org/breweries?by_state='+state;
    logger.log(endpoint);
    
    request(endpoint, ip, (err, response, body) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(body));

        var ans = body.replace(/\'/g, "\'\'");
        logger.insert(ip, endpoint, JSON.stringify(body));
        var obj = {'ip':ip,'endpoint':endpoint,'body':body};

        io.emit("message-logged", obj);
    });

});

//app.get('/api/v1/brews/')

//https://api.openbrewerydb.org/breweries?by_state=maryland