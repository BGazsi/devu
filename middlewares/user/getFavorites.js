var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var placeModel = requireOption(objectrepository, 'placeModel');
    return function (req, res, next) {
        if(req.session.user) {

            placeModel.find({
                _id: {$in: req.session.user.favorites }
            }).exec(function(err, results) {
                res.tpl.favorites = results;
                res.tpl.extraPlaceClass = 'col-md-3 col-sm-4';
                return next();
            });

        } else {
            return res.redirect('/home');
        }
    };
};