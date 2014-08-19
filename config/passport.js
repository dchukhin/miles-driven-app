// load strategy
var LocalStrategy = require('passport-local').Strategy;

// load user 
var User = require('../app/models/user');

// expose this function using module.exports
module.exports = function(passport) {
    // passport setup
    // users must be serialized and unserialized out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {

        process.nextTick(function() {

        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username already exists.  Try a different username.'));
            } else {

                var newUser = new User();

                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // LOCAL LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {

        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'User not found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect password.'));

            return done(null, user);
        });

    }));



};


