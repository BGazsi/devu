var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var tagModel = requireOption(objectrepository, 'tagModel');

    return function (req, res, next) {
        if(res.tpl.place) {
            tagModel.find({
                _id: {$in: res.tpl.place.tags}
            }).exec(function(err, results) {
                res.tpl.tags = results;
                return next();
            });
        } else {
            res.tpl.error.push('Nincs hely!');
            res.tpl.tags = [];
            return next();
        }
    };
};