var renderTemplateMW = require('../middlewares/generic/renderTemplate');
var hasPermissionMW = require('../middlewares/generic/hasPermission');
var getAllUsersMW = require('../middlewares/user/getAllUsers');
var getAllTagsMW = require('../middlewares/tag/getAllTags');
var getAllPlacesMW = require('../middlewares/place/getAllPlaces');
var editPlaceMW = require('../middlewares/place/editPlace');
var deletePlaceMW = require('../middlewares/place/deletePlace');
var getOnePlaceMW = require('../middlewares/place/getOnePlace');
var createTagMW = require('../middlewares/tag/createTag');
var createPlaceMW = require('../middlewares/place/createPlace');
var getOneUserMW = require('../middlewares/user/getOneUser');
var getOneTagMW = require('../middlewares/tag/getOneTag');
var editTagMW = require('../middlewares/tag/editTag');
var deleteTagMW = require('../middlewares/tag/deleteTag');
var editUserMW = require('../middlewares/user/editUser');
var deleteUserMW = require('../middlewares/user/deleteUser');

var userModel = require('../models/users');
var tagModel = require('../models/tags');
var placeModel = require('../models/places');

var express = require('express');
var router = express.Router();
var constants = require('../config/constants');

var objectRepository = {
    userModel: userModel,
    tagModel: tagModel,
    placeModel: placeModel,
    roleNeeded: constants.ROLE_ADMIN
};

router.use('/addTag',
    hasPermissionMW(objectRepository),
    createTagMW(objectRepository)
);

router.post('/addPlace',
    hasPermissionMW(objectRepository),
    createPlaceMW(objectRepository)
);

router.use('/edit-user/:userid',
    hasPermissionMW(objectRepository),
    getOneUserMW(objectRepository),
    editUserMW(objectRepository)
);

router.use('/remove-user/:userid',
    hasPermissionMW(objectRepository),
    getOneUserMW(objectRepository),
    deleteUserMW(objectRepository)
);

router.use('/edit-place/:placeid',
    hasPermissionMW(objectRepository),
    getOnePlaceMW(objectRepository),
    editPlaceMW(objectRepository)
);

router.use('/remove-place/:placeid',
    hasPermissionMW(objectRepository),
    getOnePlaceMW(objectRepository),
    deletePlaceMW(objectRepository)
);

router.use('/edit-tag/:tagid',
    hasPermissionMW(objectRepository),
    getOneTagMW(objectRepository),
    editTagMW(objectRepository)
);

router.use('/remove-tag/:tagid',
    hasPermissionMW(objectRepository),
    getOneTagMW(objectRepository),
    getAllPlacesMW(objectRepository),
    deleteTagMW(objectRepository)
);

router.use('/',
    hasPermissionMW(objectRepository),
    getAllUsersMW(objectRepository),
    getAllTagsMW(objectRepository),
    getAllPlacesMW(objectRepository),
    renderTemplateMW('admin', objectRepository)
);

module.exports = router;