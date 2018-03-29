var renderTemplateMW = require('../middlewares/generic/renderTemplate');
var getAllPlacesMW = require('../middlewares/place/getAllPlaces');
var getTopPlacesMW = require('../middlewares/place/getTopPlaces');
var getAllTagsMW = require('../middlewares/tag/getAllTags');

var placeModel = require('../models/places');
var tagModel = require('../models/tags');

var express = require('express');
var router = express.Router();

var objectRepository = {
    placeModel: placeModel,
    tagModel: tagModel
};

//main redirect
router.get('/', function(req, res, next) {
    req.session.user ? res.redirect('/home') : res.redirect('/user/login');
    return next();
});

router.use('/home',
    getAllPlacesMW(objectRepository),
    getTopPlacesMW(objectRepository),
    getAllTagsMW(objectRepository),
    renderTemplateMW('home', objectRepository)
);

router.use('/landing',
    renderTemplateMW('landing', objectRepository)
);

module.exports = router;