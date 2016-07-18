'use strict';
const confs = require('./config');
const net = require('net');
const repl = require('repl');
const util = require('util');  // console.log(util.inspect(myObject, {showHidden: false, depth: null}));
                               // console.log(util.format('%s, %d', var, num));

// TODO: to finish...

// on telnet .help to options

var motd = () => console.log(" ngMonSchedululer console!");

function run(cmd, context, filename, callback) {
    callback(null,cmd);
}


net.createServer(function(socket){

    const replObj = {  prompt: "$> ", input: socket, output: socket, eval: run, "ignoreUndefined" : true, };

    // you can use "load": "file.js" inside obj :)

    var console = repl.start(replObj);

    console.defineCommand('queue', {
        help: "sample command",
        action: function(){ this.close(); }
    });

}).on('exit', function(){
    socket.end();
}).listen(confs.repl.port);