var requireOption = require('../common').requireOption;
module.exports = function (objectRepository) {

    return function(req, res, next) {
        var allPlace = res.tpl.places;

        allPlace.sort(function(a, b) {
            var aCommon = a.tags.filter(function(n) {
                return res.tpl.place.tags.indexOf(n) != -1;
            }).length;
            var bCommon = b.tags.filter(function(n) {
                return res.tpl.place.tags.indexOf(n) != -1;
            }).length;

            //a megnyitott helyet ne tegyuk a listaba
            if(a._id === res.tpl.place._id) {
                aCommon = -1;
            }
            if(b._id === res.tpl.place._id) {
                bCommon = -1;
            }
            return -(aCommon - bCommon);
        });

        res.tpl.similar = allPlace.slice(0, 5);
        return next();
    }
};