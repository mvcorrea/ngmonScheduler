"use strict";
const zmq = require('zmq');

const subscriber = zmq.socket('sub');

subscriber.subscribe('');

// TODO: go inside REPL :)

subscriber.on("message", function(data){
    let message = JSON.parse(data),
        ts = (message.env.split(':'))[1],
        date = new Date(parseInt(ts));

    console.log(date.toISOString()+": "+data);
});

subscriber.connect('tcp://localhost:5000');
