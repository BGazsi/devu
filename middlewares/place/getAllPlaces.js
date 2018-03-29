var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    var placeModel = requireOption(objectRepository, 'placeModel');

    return function(req, res, next) {
        placeModel.find({

        }).exec(function (err, results) {
            if (err) {
                res.tpl.error.push('Hiba a helyek lekérésekor!');
                return next();
            }
            res.tpl.places = results;
            return next();
        });
    }
};