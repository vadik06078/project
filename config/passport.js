var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField:'email',
            passwordField:'password',
            passReqToCallback : true
        },
        function(req, email,password,done){

            req.check('email', 'Invalid email').isEmail();
            req.check('password', 'Password is invalid').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g).isLength({min: 8});

            var errors = req.validationErrors();

            process.nextTick(function(){
                User.findOne({'local.email':email}, function(err, user){
                    if(errors){

                        if (errors[0].param === "email") {
                            return done(null, false, req.flash('signupMessage', 'Incorrect Email'));
                        };


                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is ready'));
                        } else {
                            if ((errors[0].param === "password") || (errors[1].param === "password")) {
                                return done(null, false, req.flash('signupMessage', 'Incorrect Password'));
                            }                            ;
                        };

                    } else {

                        if(err)
                            return done(err);

                        if(user){
                            return done(null, false, req.flash('signupMessage', 'That email is ready'))
                        } else {
                            var newUser = new User();
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function(err){
                                if(err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    }




                });
            });
    }));


    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        req.check('email', 'Invalid email').isEmail();
        req.check('password', 'Password is invalid').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g).isLength({min: 8});

        var errors = req.validationErrors();




            User.findOne({'local.email': email}, function (err, user) {

                if(errors){

                    if (errors[0].param === "email") {
                        return done(null, false, req.flash('loginMessage', 'Incorrect Email'));
                    };

                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    } else {
                        if((errors[0].param === "password") || (errors[1].param === "password")){
                            return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
                        };
                    }
                } else {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Wrong password'));


                    return done(null, user);
                }
            });

    }));

};