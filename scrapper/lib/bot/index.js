var users = [
    {
        user: 'user1',
        time: 200000,
        part: '/'
    },
    {
        user: 'user2',
        time: 300000,
        part: '?source=linkedin'
    },
    {
        user: 'user3',
        time: 400000,
        part: '?location=defence'
    },
    {
        user: 'user4',
        time: 300000,
        part: '?keyword=Software%20Quality'
    },
    {
        user: 'user5',
        time: 500000,
        part: '?provider=TRG'
    },
    {
        user: 'user6',
        time: 400000,
        part: '/'
    },
    {
        user: 'user7',
        time: 350000,
        part: '?tags=informationtechnology'
    },
    {
        user: 'user8',
        time: 400000,
        part: '?keyword=Finance%20Manager'
    },
    {
        user: 'user9',
        time: 500000,
        part: '?keyword=Sales'
    },
    {
        user: 'user10',
        time: 450000,
        part: '?tags=Sales'
    }
];
var async = require('async');
var spawn = require('child_process').spawn;

async.eachSeries(users, function(user, callback) {
    console.log("serving user : "+user.user);
    setTimeout(function () {
        console.log("...executing");
        spawn('node', ['./bot/bot.js', user.part, user.time]);
        callback();
    }, 80000)
    console.log("...waiting");
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("%%%%%%%%%%% DONE %%%%%%%%%%%%");
    }
});
