var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var placeModel = requireOption(objectrepository, 'placeModel');

    return function (req, res, next) {
        placeModel.findOne({
            _id: req.param('placeid')
        }).exec(function (err, result) {
            if (err) {
                res.tpl.error.push(err);
                return next(err);
            }
            res.tpl.place = result;
            res.tpl.currentUserRating = -1;
            if(res.tpl.user) {
                res.tpl.user.ratedPlaces.forEach(function(object, i) {
                    if(object.placeID == result.id) {
                        res.tpl.currentUserRating = object.value;
                    }
                });
            }

            return next();
        });
    };
};