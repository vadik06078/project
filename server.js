var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var expressValidator = require('express-validator');

var Author = require('./app/models/author');
var Book = require('./app/models/books');



mongoose.connect(configDB.url, {useMongoClient: true});

require('./config/passport')(passport);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));
app.use(cookieParser());
//app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: false}));  // was extended true!!!!!???????????????
app.use(bodyParser.json());
app.use(expressValidator());

app.set('view engine', 'ejs');

app.use(session({secret: 'ilovescotchio',
    name: 'ilovescotchiooo',
   // store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: false,     // was save Unitialized: true !!!!!?????????????
    resave : false
}));   //???????
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var v = require('./app/routes.js')(app,passport);


app.listen(port);
console.log('The magic happens on port ' + port);


var aboutBook = {   //????????????????????????????????????????????????
    name :"kjhb",
    sname : "234"
};;

var aboutAuthor = {   //????????????????????????????????????????????????
    name :"kjhb",
    sname : "234"
};





/*

var Frai = new Author ( {
    _id : new mongoose.Types.ObjectId(),
    name : "Alex",
    sname : "Smith",
    age : 40
    });


Frai.save(function(err){
    if(err)
        throw err;
    //return done(null, Frai)
    console.log('Author successfully saved.');

});

/////////////////////////////////////////////////////////////////////////////////////

var Stranger = new Book ({
    _id : new mongoose.Types.ObjectId(),
    bookname: "Top Secret",     //Stranger,Volunteers, Simple magic things, Dark side, Illusions/ The power of the unfulfilled,Gossip
    author: Frai._id,
    year: 1989,
    pubHouse: "Russian Club",
    secHand: true
});


Stranger.save(function(err) {
    if (err)
        throw err;
    //return done(null, Frai)
    console.log('Book successfully saved.');
});*/
/*
var obj = { pubHouse : "Amfora"};
/////////////////////////////////////////////////////////////////////////////////////////
    Book.find(obj, function (err, tester) {
     //   console.log(tester);
        aboutBook = tester;
        var aboutAuthor = [aboutBook.length];
        console.log("1111111111111-" + aboutBook.length);
        //aboutAuthor = tester;
        aboutBook.forEach(function(Book, i) {
            Author.findOne({_id: Book.author}, function (err, tester) {
                aboutAuthor[i] = tester;
                console.log(tester);
            })
        });

    });
*/
//});

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














