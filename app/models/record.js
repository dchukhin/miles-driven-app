// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var recordSchema = mongoose.Schema({

    username     : String,
    dayofmonth   : Number,
    month        : Number,
    year         : Number,
    miles        : Number,
    hours        : Number
    
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Record', recordSchema);
