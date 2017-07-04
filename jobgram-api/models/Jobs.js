var mongoose = require('mongoose');

var jobsSchema = new mongoose.Schema({
    "jobName" : String,
    "start" : Date,
    "end" : Date,
    "status" : String,
    "logs" : String
  }
  ,{
  collection : "jobs"
});

var jobs = mongoose.model('jobs', jobsSchema);

module.exports = jobs;
