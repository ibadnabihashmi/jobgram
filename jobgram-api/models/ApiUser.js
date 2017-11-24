var mongoose = require('mongoose');

var apiuserSchema = new mongoose.Schema({
    "user" : String,
    "key" : String,
  }
  ,{
    collection : "apiusers"
  });

var apiusers = mongoose.model('apiusers', apiuserSchema);

module.exports = apiusers;
