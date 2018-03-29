var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var tagModel = requireOption(objectrepository, 'tagModel');

    return function (req, res, next) {

        tagModel.findOne({
            _id: req.param('tagid')
        }).exec(function (err, result) {
            if (err) {
                res.tpl.error.push(err);
                return next(err);
            }
            res.tpl.tag = result;
            return next();
        });
    };
};