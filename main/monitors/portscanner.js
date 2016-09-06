const globals     = require('./globals');
const portscanner = require('portscanner');

module.exports = {
    run: function(env) {
        return new Promise( (resolve, reject) => {
            var out = globals.normalize(env);
            portscanner.checkPortStatus(env.args.port, env.dev, function(err, status){ // TODO: multiple ports
                out.status = status == 'open' ? 0 : -1;
                resolve(out);
            });
        });
    },

    all: function(){}
}
