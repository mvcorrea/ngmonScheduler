"use strict"
var app = require('http').createServer(handler),
    url = require('url'),
    io  = require('socket.io')(app),
    zmq = require('zmq'),
    sub = zmq.socket('sub');

app.listen(8000, () => console.log("listening on port 8000"));


function handler(req, res){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
        "<style> #msg { font-family:courier, monotype; font-size:smaller; color:blue }</style>\n" +
        "<script src='/socket.io/socket.io.js'></script>\n" +
        "<script src='http://code.jquery.com/jquery-3.1.0.slim.min.js'></script>\n" +
        "<script> var skt = io(); skt.on('event', (x) => $('#msg').append($('<li>').text(x.fail))); </script>\n" +
        "<div id='msg'></div>\n"
    );
};

const confZMQ = function(subscriber){

    const conf = { // should not be here or passed as args
        "msgQueue": "server01",
        "serverAddr": "127.0.0.1",
        "serverPort": 5000 };

    var srvURI = 'tcp://' + conf.serverAddr + ':' + conf.serverPort;
    subscriber.connect(srvURI);
    subscriber.subscribe(conf.msgQueue);
    console.log('> subscriber connected to ' + srvURI );
};

confZMQ(sub);

io.on('connection', function (socket) {
    sub.on('message', function(topic, data){
        //console.log(JSON.parse(data));
        var message = JSON.parse(data),
            ts = message.time,
            date = new Date(parseInt(ts));
        var out = date.toISOString()+": "+topic+": "+data;
        socket.emit('event', { 'fail': out });
    });
});