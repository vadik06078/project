var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

var message = "";

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
                    if(req.body.email === "123")
                    {
                        req.body.email = "";
                    };


                    if(errors){
                        if (errors[0].param === "email") {
                            message = ['Incorrect Email', req.body.email];
                            return done(null, false, req.flash('signupMessage', message));
                        };


                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is ready'));
                        } else {
                            console.log("qqqqqqqqqqq " + req.body.email);
                            if ((errors[0].param === "password") || (errors[1].param === "password")) {
                                message = ['Incorrect Password', req.body.email];
                                return done(null, false, req.flash('signupMessage', message));
                            };
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
        req.check('email', 'Invalid email').isEmail().notEmpty();
        req.check('password', 'Password is invalid').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g).isLength({min: 8}).notEmpty();

        var errors = req.validationErrors();

        if((req.body.email === "123") || (req.body.password === "123"))
        {
            req.body.email = "";
            req.body.password = "";
        };

        console.log(errors);

            User.findOne({'local.email': email}, function (err, user) {

                if(req.body.email === "123")
                {
                    req.body.email = "";
                };

                if(errors){

                    if (errors[0].param === "email") {
                        console.log(errors);
                         message = ['Incorrect Email', req.body.email];
                        return done(null, false, req.flash('loginMessage', message));
                    };

                    if (!user) {
                         message = ['No user found', req.body.email];
                        return done(null, false, req.flash('loginMessage', message));
                    } else {
                        if((errors[0].param === "password") || (errors[1].param === "password")){
                            console.log(errors);
                            message = ['Incorrect Password', req.body.email];
                            return done(null, false, req.flash('loginMessage', message));
                        };
                    }
                } else {
                    if (err)
                        return done(err);
                    if (!user){
                        console.log("2223333");
                        message = ['No user found', req.body.email];
                        return done(null, false, req.flash('loginMessage', message));
                    }

                    if (!user.validPassword(password)){
                        message = ['Wrong password', req.body.email];
                        return done(null, false, req.flash('loginMessage', message));
                    }

                    return done(null, user);
                }
            });

    }));

};