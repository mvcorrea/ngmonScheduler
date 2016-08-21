module.exports = function(env, cb) {
    var portscanner = require('portscanner');

    var devices = env.devs;
    var port    = env.args.port;  // TODO: multiple ports

    function normalize(env, dev, stat){
        return {env: env.taskId+"."+env.runId, device: dev, status: stat};
    }

    devices.forEach(function(dev){
        portscanner.checkPortStatus(port, dev, function(err, status) {
            if(err){
                cb( err );
            } else {
                // Status is 'open' if currently in use or 'closed' if available
                cb( null, normalize(env, dev, status=='open'?0:-1 ));
            }
        });
    });
};
