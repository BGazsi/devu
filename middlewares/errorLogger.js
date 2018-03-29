/*
 Az error tomb tartalmat irja ki a konzolra
 */

var colors = require('colors');

module.exports = function () {
    return function(req, res, next) {
        for (var i in res.tpl.error) {
            console.log(colors.red('[ERROR_LOG] ' + res.tpl.error[i]));
        }
        return next();
    }
};