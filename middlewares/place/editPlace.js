var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var placeModel = requireOption(objectrepository, 'placeModel');

    return function (req, res, next) {
        var place;
        if (typeof res.tpl.place !== 'undefined') {
            place = res.tpl.place;
            place.name = req.body.name;
            place.description = req.body.description;
            place.pictures[0] = req.body.picture;
            place.verified = req.body.verified;
            place.position.long = req.body.long;
            place.position.lat = req.body.lat;

            place.save(function (err) {
                res.tpl.error.push(err);
                res.redirect('/admin/main');
                return next();
            });

        } else {
            res.tpl.error.push('Nincs meg a hely!');
            return next();
        }
    }
};