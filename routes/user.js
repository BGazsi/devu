var userModel = require('../models/users');
var placeModel = require('../models/places');

var constants = require('../config/constants');
var renderTemplateMW = require('../middlewares/generic/renderTemplate');
var registerMW = require('../middlewares/user/register');
var loginMW = require('../middlewares/user/login');
var hasPermissionMW = require('../middlewares/generic/hasPermission');
var logoutMW = require('../middlewares/user/logout');
var getFavoritesMW = require('../middlewares/user/getFavorites');
var addFavoriteMW = require('../middlewares/user/addFavorite');
var getCurrentUserMW = require('../middlewares/user/getCurrentUser');

var express = require('express');
var router = express.Router();

var objectRepository = {
    'userModel': userModel,
    'placeModel': placeModel,
    'roleNeeded': constants.ROLE_USER
};

router.get('/register',
    renderTemplateMW('register')
);

router.post('/register',
    registerMW(objectRepository)
);

router.get('/login',
    function(req, res, next) {
        if(req.session.user) {
            res.redirect('/home');
        }
        return next();
    },
    renderTemplateMW('login')
);

router.post('/login',
    loginMW(objectRepository)
);

router.post('/logout',
    logoutMW
);

router.get('/favorites',
    hasPermissionMW(objectRepository),
    getFavoritesMW(objectRepository),
    renderTemplateMW('favorites', objectRepository)
);

router.post('/addFavorite/:placeid',
    getCurrentUserMW(objectRepository),
    addFavoriteMW(objectRepository)
);

module.exports = router;