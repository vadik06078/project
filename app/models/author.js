var mongoose = require('mongoose');


var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    sname: String,
    age: Number
});


module.exports = mongoose.model('Author', authorSchema);