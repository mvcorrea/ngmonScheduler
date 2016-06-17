// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`

require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var name = file.replace('.js', '');
        // go up one level and export individual defaults functions
        // this file exports multiple functions
        // if(name == 'defaults')
        exports[name] = require('./' + file);
    }
});
