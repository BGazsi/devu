module.exports = function(req, res, next) {

	delete req.session.user;
	res.redirect('/home');
	return next();
};