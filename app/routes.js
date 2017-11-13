/* var myObj = require("../server.js");
console.log("11111111111111111111111111111111111111");
console.log(myObj);




console.log("!!!!!!!" + myObj);
*/
var aboutBook = {}; /*= {   //????????????????????????????????????????????????
    name :"kjhb",
    sname : "234"
};*/
var aboutAuthor = {   //????????????????????????????????????????????????
    name :"kjhb",
    sname : "234"
};


var expressValidator = require('express-validator');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static(__dirname + "/"));
app.use(expressValidator());

var Author = require('./models/author');
var Book = require('./models/books');

var flash = require('connect-flash');
app.use(flash());

module.exports = function(app, passport) {
   // var myObj = {secHand : "true"};

    app.get('/', function(req, res){
        res.render('index.ejs', {message: req.flash("qwe")});
    });

    app.get('/login', function(req,res){
            res.render('login.ejs', {message: req.flash('loginMessage') });
    });

    app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage')} );
});

    app.post('/signup', function(req, res, next){
        req.check('email', 'Invalid email').isEmail();
        req.check('password', 'Password is invalid').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g).isLength({min: 8});

        var errors = req.validationErrors();
        if(errors){
            //res.render('signup.ejs', req.flash('loginMessage', 'No user found'));

            console.log("i catch it");

            if (req.body.email === ""){
                req.body.email = "123";
            }

            if (req.body.password === ""){
                req.body.password = "123";
            }

            console.log(req.body.password);
            next();
        } else {
            next();
        }
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));



    app.post('/login', function(req, res, next){
        req.check('email', 'Invalid email').isEmail();
        req.check('password', 'Password is invalid').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g).isLength({min: 8});

        var errors = req.validationErrors();
        if(errors){

            console.log("i catch it");

            if (req.body.email === ""){
                req.body.email = "123";
            }

            if (req.body.password === ""){
                req.body.password = "123";
            }

            next();
        } else {
            next();
        }


    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));





    app.post('/mainPage', urlencodedParser, function(req,res){

        if ((req.body.filter === "name") || (req.body.filter === "sname")){
            console.log("попался");

          //  delete aboutBook;
          //  var aboutBook = {};

            s = "{" + '"' + req.body.filter + '" : "' + req.body.id + '"' + "}";
            console.log("--------------" + s);
            var paramFiltr = JSON.parse(s);

            Author.find(paramFiltr, function (err, tester) {
                //   console.log(tester);
                if (err) console.log("no Author");
                aboutAuthor = tester;
                console.log(tester);

             /*   for(var key in aboutAuthor){
                    aboutBook[key] = aboutAuthor[key];
                }*/
                console.log("---//---  ");
                console.log(aboutBook);

                var count = 0;
                aboutAuthor.forEach(function(Author, i) {
                    Book.findOne({ author: Author._id}, function (err, tester) {
                        if(err) console.log("no Book");
                        aboutBook[i] = tester;
                       // console.log(tester);
                        count++;
                      //  console.log("------  " + count + "  " + aboutAuthor.length);
                        if(count === aboutAuthor.length){
                            res.render('mainPage', {
                                Books : aboutBook,
                                Authors : aboutAuthor,
                                flag : false
                            });
                            console.log(aboutBook);

                        }
                    });

                });
            });


        } else {
            s = "{" + '"' + req.body.filter + '" : "' + req.body.id + '"' + "}";
            console.log("--------------" + s);
            var paramFiltr = JSON.parse(s);

            Book.find(paramFiltr, function (err, tester) {
                //   console.log(tester);
                if(err) console.log("no book");
                aboutBook = tester;
               // console.log(tester);

                var count = 0;
                aboutBook.forEach(function(Book, i) {
                    Author.findOne({_id: Book.author}, function (err, tester) {
                        if(err) console.log("no Author");
                        aboutAuthor[i] = tester;
                       // console.log(tester);
                        count++;
                        if(count === aboutBook.length){
                            res.render('mainPage', {
                                Books : aboutBook,
                                Authors : aboutAuthor,
                                flag : true
                            });
                        }
                    });

                });

            });
/*
            Author.find({name : "Maks"}, function (err, tester) {
            if (err) console.log("no Author");
            aboutAuthor = tester;
                console.log("------------------");
            console.log(tester);
                console.log(aboutAuthor._id);
            Book.findOne({ author: aboutAuthor._id}, function (err, tester) {
                if(err) console.log("no Book");
                console.log(tester);

            });
         });*/

        }

/*
         s = "{" + '"' + req.body.filter + '" : "' + req.body.id + '"' + "}";
        console.log("--------------" + s);
         paramFiltr = JSON.parse(s);
        console.log(k); */

       // var id = req.body.id;
      // console.log("--------------" + id);
        /* if(!req.body) return res.sendStatus(400);
        console.log(req.body);
        console.log("----------------------------");
        console.log(req.body.selected);*/
       // res.render('mainPage.ejs', { data : "data"});
    });



    app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', {
        user:req.user
    });
});

    app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});
/*
    var aboutBook = {
        name:"Vasya",
        sname:"Ivanov"
    };
*/


////////////////////////////////////////////////////////////////////////////
 /*  app.get('/mainPage', function(req,res){
       res.render('mainPage', {name : myObj});
       // res.render('mainPage.ejs');
       // res.json({"data" : "data"});
    });
 ///////////////////////////////////////////////////////////////////////////




 /*   app.get('/mainPage', function(req,res){


         res.json({"data" : "data"});
    });*/


};




app.get('/mainPage', function(req,res){

    Book.find({secHand : "true"}, function (err, tester) {
        if(err) console.log("no book");

        //  var aboutAuthor = aboutBook; ??????????????????????????????????????????????
        aboutBook = tester;
        var count = 0;
        aboutBook.forEach(function(Book, i) {
            Author.findOne({_id: Book.author}, function (err, tester) {
                if(err) console.log("no Author");
                aboutAuthor[i] = tester;
                count++;
                if(count === aboutBook.length){
                    res.render('mainPage', {
                        Books : aboutBook,
                        Authors : aboutAuthor,
                        flag : true
                    });
                    //console.log(aboutAuthor);
                }
            });

        });

    });

    /* res.render('mainPage', {
         Books : aboutBook,
         Authors : aboutAuthor
     });*/

});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}