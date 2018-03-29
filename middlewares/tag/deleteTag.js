var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var tagModel = requireOption(objectrepository, 'tagModel');

    return function (req, res, next) {
        tagModel.find({
            _id: req.param('tagid')
        }).remove().exec();

        var placeToSave;
        res.tpl.places.forEach(function(place, i) {
            placeToSave = place;
            if(placeToSave.tags.indexOf(req.param('tagid')) != -1) {
                placeToSave.tags.splice(placeToSave.tags.indexOf(req.param('tagid')), 1);

                placeToSave.save(function(err) {
                    res.tpl.error.push(err);
                });
            }
        });
        res.redirect('/admin');
        return next();
    }
};