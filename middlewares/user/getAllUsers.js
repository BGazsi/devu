var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    var userModel = requireOption(objectRepository, 'userModel');

    return function(req, res, next) {

        userModel.find({

        }).exec(function (err, results) {
            if (err) {
                res.tpl.error.push('Hiba a felhasználók lekérésekor!')
            }

            res.tpl.users = results;
            return next();
        });
    }
};