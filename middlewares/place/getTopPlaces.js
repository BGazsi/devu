var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    return function(req, res, next) {
        var allPlace = res.tpl.places;

        allPlace.sort(function(a, b) {
            if(!a.verified) {
                a.ratings.aggregate = -1;
            }
            if(!b.verified) {
                b.ratings.aggregate = -1;
            }
            return -(a.ratings.aggregate - b.ratings.aggregate);
        });

        res.tpl.top = allPlace.slice(0, 5);
        return next();

    }
};