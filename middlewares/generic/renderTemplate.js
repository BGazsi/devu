/*
 Kapott nevu templatet renderel ki a templateengine segitsegevel
 */

var constants = require('../../config/constants');
module.exports = function (viewName, objectRepository) {

    return function (req, res) {

        res.render(viewName, {
            user: req.session.user,
            tpl:  res.tpl
        });
    };
};