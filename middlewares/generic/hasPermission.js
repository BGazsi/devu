module.exports = function (objectRepository) {

    return function(req, res, next) {
        if(req.session.user !== undefined && req.session.user.role <= objectRepository.roleNeeded) {
            return next();
        } else {
            res.tpl.error.push('Nincs megfelelő hozzáférésed a kért oldal megtekintéséhez!');
            req.session.user ? res.redirect('/home') : res.redirect('/user/login');
        }
    }
};