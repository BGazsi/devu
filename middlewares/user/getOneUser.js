var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var userModel = requireOption(objectrepository, 'userModel');

    return function (req, res, next) {
        userModel.findOne({
            _id: req.param('userid')
        }).exec(function (err, result) {
            if (err) {
                res.tpl.error.push(err);
                return next(err);
            }
            res.tpl.user = result;
            return next();
        });
    };
};