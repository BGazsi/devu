var requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    var placeModel = requireOption(objectRepository, 'placeModel');
    return function (req, res, next) {
        var user = res.tpl.user;
        if(user === undefined || user.role > objectRepository.roleNeeded) {
            res.status(500).send({error: 'you have an error'});
            res.tpl.error.push('Nincs megfelelő hozzáférésed a kért oldal megtekintéséhez!');
            res.end('{"error" : "Not logged in", "status" : 500}');
        }

        var value   = req.body.value,
            place = res.tpl.place,
            index = -1,
            newRatingObject = {
                placeID: place.id,
                value:  parseInt(value)
            };

        user.ratedPlaces.forEach(function(value, i) {
            if(value.placeID == place.id) {
                index = i;
            }
        });

        if(index === -1) {
            if(req.session.user.sex == 'female') {
                place.ratings.female.avg = ((place.ratings.female.count * place.ratings.female.avg) + parseInt(value)) / ++place.ratings.female.count;
            } else {
                place.ratings.male.avg = ((place.ratings.male.count * place.ratings.male.avg) + parseInt(value)) / ++place.ratings.male.count;
            }
            user.ratedPlaces[user.ratedPlaces.length] = newRatingObject;
        } else {
            if(req.session.user.sex == 'female') {
                place.ratings.female.avg = ((place.ratings.female.count * place.ratings.female.avg) + parseInt(value) - user.ratedPlaces[index].value) / place.ratings.female.count;
            } else {
                place.ratings.male.avg = ((place.ratings.male.count * place.ratings.male.avg) + parseInt(value) - user.ratedPlaces[index].value) / place.ratings.male.count;
            }
            user.ratedPlaces[index] = newRatingObject;
        }

        var femaleRating = place.ratings.female.avg,
            maleRating = place.ratings.male.avg,
            aggregateRating;

        if(maleRating > 0 && femaleRating > 0) {
            aggregateRating = (femaleRating + maleRating) / 2;
        } else if (maleRating > 0) {
            aggregateRating = maleRating;
        } else {
            aggregateRating = femaleRating;
        }

        place.ratings.aggregate = aggregateRating;

        user.save(function(err) {
            if(err) {
                res.tpl.error.push(err);
                console.log(err);
            }
        });

        place.save(function(err) {
            if(err) {
                res.tpl.error.push(err);
            } else {
                res.statusCode = 200;
            }
        });

        var json = JSON.stringify({
            success: "Updated Successfully",
            status: 200,
            aggregateRating: aggregateRating,
            maleRating: maleRating,
            femaleRating: femaleRating
        });

        res.end(json);
        return next();
    }
};