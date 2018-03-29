var placeModel = require('../models/places');
var userModel = require('../models/users');
var tagModel = require('../models/tags');

var constants = require('../config/constants');
var createPlaceMW = require('../middlewares/place/createPlace');
var getOnePlaceMW = require('../middlewares/place/getOnePlace');
var getAllPlacesMW = require('../middlewares/place/getAllPlaces');
var hasPermissionMW = require('../middlewares/generic/hasPermission');
var renderTemplateMW = require('../middlewares/generic/renderTemplate');
var getCurrentUserMW = require('../middlewares/user/getCurrentUser');
var getPlaceTagsMW = require('../middlewares/tag/getPlaceTags');
var getAllTagsMW = require('../middlewares/tag/getAllTags');
var ratePlaceMW = require('../middlewares/place/ratePlace');
var getTopPlacesMW = require('../middlewares/place/getTopPlaces');
var getSimilarPlacesMW = require('../middlewares/place/getSimilarPlaces');
var searchPlacesMW = require('../middlewares/place/searchPlaces');

var express = require('express');
var router = express.Router();

var objectRepository = {
    placeModel: placeModel, 
    userModel: userModel,
    tagModel: tagModel,
    roleNeeded: constants.ROLE_USER
};

//osszes hely listazasa
router.get('/all',
    getAllPlacesMW(objectRepository)
);

router.get('/addPlace',
    hasPermissionMW(objectRepository),
    getAllTagsMW(objectRepository),
    renderTemplateMW('addPlace', objectRepository)
);

//hely hozzaadasa
router.post('/addPlace',
    hasPermissionMW(objectRepository),
    createPlaceMW(objectRepository)
);

//placeid idju hely lekereses
router.get('/:placeid',
    getCurrentUserMW(objectRepository),
    getAllPlacesMW(objectRepository),
    getTopPlacesMW(objectRepository),
    getOnePlaceMW(objectRepository),
    getPlaceTagsMW(objectRepository),
    getSimilarPlacesMW(objectRepository),
    renderTemplateMW('placeDetails', objectRepository)
);

router.post('/rate/:placeid',
    getOnePlaceMW(objectRepository),
    getCurrentUserMW(objectRepository),
    ratePlaceMW(objectRepository)
);

router.post('/search',
    getAllPlacesMW(objectRepository),
    getTopPlacesMW(objectRepository),
    getAllTagsMW(objectRepository),
    searchPlacesMW(objectRepository),
    renderTemplateMW('list', objectRepository)
);

module.exports = router;