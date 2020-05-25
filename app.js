/*
let sayHello = (name, name2) => {
    return console.log('hello ' + name + ' ' + name2);
};
sayHello('Ben', 'Joe');
*/
const logger = require('./logger');
const os = require('os');
const fs = require('fs');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

fs.readdir('./', (err, files) => {
    logger(files);
});

//register a listener
myEmitter.on('messageLogged', (message) => {
    logger(message);
});
myEmitter.on('error', (message) => {
    logger(message);
})


//signal an event has happened
myEmitter.emit('messageLogged', 'hey there');
myEmitter.emit('error', 'uh oh');

