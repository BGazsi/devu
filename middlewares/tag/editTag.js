var requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    var tagModel = requireOption(objectRepository, 'tagModel');

    return function (req, res, next) {
        var tag;
        if (typeof res.tpl.tag !== 'undefined') {
            tag = res.tpl.tag;
            tag.name = req.body.name;
            tag.icon= req.body.icon;

            tag.save(function (err) {
                res.tpl.error.push(err);
                res.redirect('/admin/main');
                return next();
            });

        } else {
            res.tpl.error.push('Nincs meg a tag!');
            return next();
        }
    }
};