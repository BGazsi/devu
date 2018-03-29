var CONSTANTS = require('../../config/constants');
var requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    var userModel = requireOption(objectRepository, 'userModel');

    return function (req, res, next) {

        //hianyzo adatok
        if ((typeof req.body === 'undefined') || (typeof req.body.email === 'undefined') ||
            (typeof req.body.password === 'undefined')) {
            return next();
        }

        //megnezzuk, hogy regisztralt-e mar
        userModel.findOne({
            email: req.body.email
        }, function (err, result) {
            if ((err) || (result !== null)) {
                res.tpl.error.push('Ez az e-mail cím már regisztrálva van!');
                res.redirect('/user/register');
                return next();
            }

            if(req.body.password !== req.body.passwordAgain) {
                res.tpl.error.push('A két jelszó nem egyezik meg');
                res.redirect('/user/register');
                return next();
            }

            //ha nem, akkor regisztraljuk
            var newUser = new userModel();
            newUser.role = CONSTANTS.ROLE_USER;
            newUser.sex = req.body.gender || 'male';
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.save(function (err) {
                //redirect to /login
                res.redirect('/user/login');
                return next();
            });
        });
    }
};