var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    var tagModel = requireOption(objectRepository, 'tagModel');

    return function(req, res, next) {

        tagModel.find({

        }).exec(function (err, results) {
            if (err) {
                res.tpl.error.push('Hiba a tagek lekérésekor!');
                return next();
            }

            res.tpl.tags = results;
            return next();
        });
    }
};