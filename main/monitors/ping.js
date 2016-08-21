const globals = require('./globals');

module.exports = function(env, cb) {
    const ping = require('net-ping');
    var devices = env.devs;

    var options = {
        packetSize: 16,
        retries: 1,
        sessionId: (process.pid % 65535),
        timeout: 2000,
        ttl: 128
    };

    var session = ping.createSession(options);

    devices.forEach(function(dev){
        session.pingHost(dev, function(err, dev){
            if(err){
                cb(null, globals.normalize(env, dev, -1)); // unreachable
            } else {
                cb(null, globals.normalize(env, dev, 0));
            }
        });
    });
}