var users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10'];
var async = require('async');
var spawn = require('child_process').spawn;

async.eachSeries(users, function(user, callback) {
    console.log("serving user : "+user);
    setTimeout(function () {
        console.log("...executing");
        spawn('node', ['./bot/bot.js', '/', '500000']);
        callback();
    }, 10000)
    console.log("...waiting");
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("%%%%%%%%%%% DONE %%%%%%%%%%%%");
    }
});
