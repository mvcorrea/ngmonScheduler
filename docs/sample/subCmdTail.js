"use strict";
const zmq = require('zmq');

const configure = function(subscriber){

    const conf = { // should not be here or passed as args
        //"msgQueue": "server01.dogPzIz8",
        "msgQueue": "server01",
        "serverAddr": "127.0.0.1",
        "serverPort": 5000
    };

    var srvURI = 'tcp://' + conf.serverAddr + ':' + conf.serverPort;
    subscriber.connect(srvURI);
    subscriber.subscribe(conf.msgQueue);
    console.log('> subscriber connected to ' + srvURI );
};

const subscriber = zmq.socket('sub');
configure(subscriber);

// TODO: go inside REPL :)

// example: reading the queue via command line
// usage: node sub.app

subscriber.on('message', function(topic, data){
    console.log(JSON.parse(data));
    //let message = JSON.parse(data),
    //    ts = (message.env.split('.'))[1],
    //    date = new Date(parseInt(ts));
    //
    //console.log(date.toISOString()+": "+topic+": "+data);
});
