var requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {
	
	var userModel = requireOption(objectRepository, 'userModel');
	
	return function(req, res, next) {

		//hianyzo adat(ok)
		if ((typeof req.body === 'undefined') || (typeof req.body.email === 'undefined') ||
			(typeof req.body.password === 'undefined')) {
			res.redirect('/user/login');
			return next();
		}

		//user megkeresese
		userModel.findOne({
			email: req.body.email
		}, function (err, user) {
			if ((err) || (!user)) {
				res.tpl.error.push('Nincs ilyen felhasználó!');
				res.redirect('/usernotfound');
				return next();
			}

			//jelszo ellenorzes
			if (user.password !== req.body.password) {
				res.tpl.error.push('Hibás jelszó!');
				res.redirect('/wrongpassword');
				return next();
			}

			if(!user.verified) {
				res.tpl.error.push('A felhasználó nincs megerősítve');
				res.redirect('/user/login');
				return next();
			}

			//ha sikeres a bejelentkezes, akkor elmentjuk a felhasznalot a sessionbe
			req.session.user = user;

			res.redirect('/home');
			return next();
		});
	}
};