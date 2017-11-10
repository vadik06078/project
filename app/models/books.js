var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookname: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Author'
    },
    year: Number,
    pubHouse: String,
    secHand: Boolean

});


module.exports = mongoose.model('Book', bookSchema);