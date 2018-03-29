var requireOption = require('../common').requireOption;
var removeFromArray = require('../common').removeFromArray;

module.exports = function (objectrepository) {

    var userModel = requireOption(objectrepository, 'userModel');

    return function (req, res, next) {
        var user;
        var placeId = req.param('placeid');
        if(req.session.user) {
            user = res.tpl.user;

            if(user.favorites.indexOf(placeId) === -1) {
                user.favorites.push(placeId);
            } else {
                user.favorites = removeFromArray(user.favorites, user.favorites.indexOf(placeId));
            }

            user.save(function(err) {
                if(err) {
                    res.tpl.error.push(err);
                    return next();
                }
            });

            req.session.user = user;
            res.tpl.user = user;
            var json = JSON.stringify({
                status: 200
            });
            res.end(json);
        } else {
            res.status(500).send({error: 'you have an error'});
            res.tpl.error.push('Nincs megfelelő hozzáférésed a kért oldal megtekintéséhez!');
            res.end('{"error" : "Not logged in", "status" : 500}');
        }
        return next();
    };
};