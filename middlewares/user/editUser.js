var requireOption = require('../common').requireOption;

module.exports = function (objectrepository) {

    var userModel = requireOption(objectrepository, 'userModel');

    return function (req, res, next) {
        var user;
        if (typeof res.tpl.user !== 'undefined') {
            user = res.tpl.user;
            user.name = req.body.name;
            user.sex = req.body.sex;
            user.verified = req.body.verified;
            user.disabled = req.body.disabled;

            user.save(function (err) {
                res.tpl.error.push(err);
                res.redirect('/admin/main');
                return next();
            });

        } else {
            res.tpl.error.push('Nincs user!');
            return next();
        }
    }
};