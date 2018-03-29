var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    var placeModel = requireOption(objectRepository, 'placeModel');

    return function(req, res, next) {
        var result = [];
        if(req.body.tags) {
            res.tpl.places.forEach(function (place) {
                req.body.tags.every(function (tag) {
                    if (place.tags.indexOf(tag) !== -1) {
                        result.push(place);
                    }
                    return !(place.tags.indexOf(tag) !== -1);
                });
            });

            res.tpl.places = result;
        }
        return next();
    }
};