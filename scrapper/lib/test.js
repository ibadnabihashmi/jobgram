var _ = require("underscore");
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/urls').mongo;
var async = require('async');

var tags = [1,2,3];

MongoClient.connect(url, function(err, db) {
    if(err){
        console.error(err);
        db.close();
    }else{
        db.collection("tags").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(_.map(result,function (tag) {
                return tag.name;
            }).join("|"));
            db.close();
        });
    }
});