var requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {
    
    var tagModel = requireOption(objectRepository, 'tagModel');
    return function (req, res, next) {
        //megnezzuk, hogy van-e mar ilyen tag
        tagModel.findOne({
            name: req.body.name
        }, function (err, result) {
            if ((err) || (result !== null)) {
                res.tpl.error.push('Már van ilyen tag az adatbázisban!');
                res.redirect('/admin/main');
                return next();
            }

            //ha nem, akkor letrehozzuk az uj taget
            //TODO default icon
            var newTag = new tagModel();
            newTag.name = req.body.name;
            newTag.icon = req.body.icon || 'defaultIcon';
            newTag.save(function (err) {
                if(err) {
                    console.log(err);
                    res.tpl.error.push(err);
                    res.redirect('/admin/main');
                }
                return next();
            });
        });
    }
};