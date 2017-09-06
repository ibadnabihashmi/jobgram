var mongoose = require('mongoose');

var tagsSchema = new mongoose.Schema({
    "name":String,
    "count":Number
  }
  ,{
    collection : "tags"
  });

var tags = mongoose.model('tags', tagsSchema);

module.exports = tags;
