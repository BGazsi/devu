var requireOption = require('../common').requireOption;
var CONSTANTS = require('../../config/constants');

module.exports = function (objectRepository) {
    var placeModel = requireOption(objectRepository, 'placeModel');
    var fileUpload;
    var cloudinary = require('cloudinary');
    cloudinary.config({
        cloud_name: CONSTANTS.CLOUD_NAME,
        api_key: CONSTANTS.CLOUD_API_KEY,
        api_secret: CONSTANTS.CLOUD_API_SECRET
    });

    return function (req, res, next) {
        var newPlace = new placeModel();
        var readFiles = function(callback) {
            if(req.files.pictureFile instanceof Array) {
                req.files.pictureFile.forEach(function(file, index) {
                    if(index === 0) {
                        fileUpload = [];
                    }
                    cloudinary.uploader.upload(file.file,
                    function(result) {
                        var temp = result.url.split('upload/');
                        temp[0] = temp[0].replace('http', 'https');
                        fileUpload.push(temp[0] + 'upload/c_fill,q_50,w_1024/' + temp[1]);

                        if(fileUpload.length === req.files.pictureFile.length) {
                            callback();
                        }
                    });
                });
            } else if(req.files.pictureFile) {
                fileUpload = [];
                cloudinary.uploader.upload(req.files.pictureFile.file,
                    function(result) {
                        var temp = result.url.split('upload/');
                        fileUpload.push(temp[0] + 'upload/c_fill,q_50,w_1024/' + temp[1]);
                        callback();
                });
            } else {
                fileUpload = [];
                callback();
            }
        };

        var save = function() {
            newPlace.name = req.body.name;
            newPlace.description = req.body.description;
            newPlace.position.long = req.body.long || '';
            newPlace.position.lat = req.body.lat || '';
            newPlace.tags = req.body.addedTags || [];
            newPlace.pictures = fileUpload || '';
            newPlace.verified = req.session.user.role === 0;

            dbSave();
        };

        var dbSave = function() {
            newPlace.save(function (err) {
                if(err) {
                    console.log(err);
                }
                if(objectRepository.roleNeeded === 0) {
                    res.redirect('/admin');
                } else {
                    res.redirect('/home');
                }
                return next();
            });
        };

        readFiles(save);
    }
};