const globals = require('./globals');
const ping    = require('net-ping');

var options = {
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
};

var session = ping.createSession(options);

module.exports = {
    run: function(env) {
        return new Promise( (resolve, reject) => {
            var out = globals.normalize(env);
            session.pingHost(env.dev, function (err, target) {
                out.status = err ? -1 : 0;
                resolve(out);
            });
        });
    },

    all: function(){

    }
}

