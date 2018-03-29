var CONSTANTS = require('./config/constants');

var routeUser = require('./routes/user');
var routeHome = require('./routes/home');
var routeAdmin = require('./routes/admin');
var routePlace = require('./routes/place');
var errorLogger = require('./middlewares/errorLogger');
var https = require('https');
var compression = require('compression');

var userModel = require('./models/users');

var morgan = require('morgan');
var express = require('express');
var session = require('express-session');
var bb = require('express-busboy');

var app = express();

bb.extend(app, {
    upload: true,
    path: 'public/uploads'
});

app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 80));

app.use(morgan('dev'));
app.use(session({
    name : 'sessionID',
    secret: 'y5y9YbpebpVEx0qv',
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {

    res.tpl = {};
    res.tpl.error = [];

    return next();
});

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: CONSTANTS.FACEBOOK_APP_ID,
        clientSecret: CONSTANTS.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        var fbUser;

        userModel.findOne({
            _id: profile.id
        }, function(err, result) {
            if(!!result) {
                fbUser = result;
            }
        });

        if(fbUser) {
            req.session.user = fbUser;
            done();
        } else {
            var gender = '';

            // a user nemet csak igy adja ki a facebook
            var fbReq = https.request({
                hostname: 'graph.facebook.com',
                method: 'GET',
                path: '/v2.0/me?access_token=' + accessToken + '&fields=gender'
            }, function(fbRes) {
                var output = '';
                fbRes.setEncoding('utf8');

                fbRes.on('data', function(chunk) {
                    output += chunk;
                });

                fbRes.on('end', function() {
                    output = JSON.parse(output);
                    gender = output.gender;

                    var userObject = {
                        _id: profile.id,
                        role: CONSTANTS.ROLE_USER,
                        email: profile.displayName,
                        sex: gender,
                        name: profile.displayName,
                        password: '',
                        favorites: [],
                        ratedPlaces: [],
                        verified: true,
                        disabled: false
                    };
                    userModel.insertMany(
                        [userObject]
                    );
                    req.session.user = userObject;
                    done();
                });

            });

            fbReq.end();

            fbReq.on('error', function(err) {
                console.error(err);
            });
        }
    }
));

app.use(compression());
app.use('/public', express.static('public', { maxAge: 86400000 }));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/home/login'
    }
    ));


app.use('/user', routeUser);
app.use('/', routeHome);
app.use('/admin', routeAdmin);
app.use('/place', routePlace);
app.use(errorLogger);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
