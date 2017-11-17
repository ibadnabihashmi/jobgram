var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');
var client = require('../config/connection.js');
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/urls').mongo;
var fs = require('fs');
var UTILS = require('./utils');

var page = 1;
var rootUrl = ['https://www.mustakbil.com/ws/jobs/search?page='+page];
var tags = [];

function saveTags(db) {
    async.eachSeries(tags,function (tag,callback) {
        UTILS.saveTags(db,tag,function (err,msg) {
            if(err){
                callback(err);
            }else{
                console.info(msg);
                callback();
            }
        });
    },function (err) {
        if(err){
            console.error(err);
            db.close();
        }else{
            db.close();
        }
    });
}

function successExecution(db,id) {
    db.collection('jobs').updateOne(
        {
            _id:id
        },{
            $set: {
                "end":new Date(),
                "status":"completed"
            }
        },function (err,result) {
            if(err){
                console.log(err);
            }else{
                console.log('state updated');
            }
            saveTags(db);
        });
}

function failureExecution(db,err,id) {
    db.collection('jobs').updateOne(
        {
            _id:id
        },{
            $set: {
                "end":new Date(),
                "status":"failed",
                "logs": err.toString()
            }
        },function (err,result) {
            if(err){
                console.log(err);
            }else{
                console.log('state updated');
            }
            saveTags(db);
        });
}

MongoClient.connect(url, function(err, db) {
    if(err){
        console.log(err);
        db.close();
    }else {
        db.collection('jobs').insertOne({
            "jobName":"mustakbil",
            "start":new Date(),
            "end":undefined,
            "status":"running",
            "logs":"clear :)"
        }, function (err, mongoResult) {
            if (err) {
                console.log(err);
                db.close();
            } else {
                console.log(mongoResult.insertedId);
                async.whilst(
                    function () {
                        return rootUrl.length !== 0;
                    },
                    function (callbackOuter) {
                        var url = rootUrl.pop();
                        console.log("==========================================================");
                        console.log("On page : "+url);
                        console.log("==========================================================");
                        fs.appendFileSync('message.txt', '\n==========================================================');
                        fs.appendFileSync('message.txt', "\nOn page : "+url);
                        fs.appendFileSync('message.txt', '\n==========================================================');
                        request(url, function(error, response, body) {
                            if(error) {
                                console.log("Error: " + error);
                                fs.appendFileSync('message.txt', "\nError: " + error);
                                failureExecution(db,error,mongoResult.insertedId);
                            }else if(response.statusCode === 200) {
                                var jobList = JSON.parse(body).list;
                                console.log('Number of links retrieved for page : '+jobList.length);
                                fs.appendFileSync('message.txt', '\nNumber of links retrieved for page : '+jobList.length);
                                async.eachSeries(jobList,function (element,callback) {
                                    var link = 'https://www.mustakbil.com/ws/jobs/job/'+element.id;
                                    console.log('Scrapping : '+link);
                                    fs.appendFileSync('message.txt', '\nScrapping : '+link);
                                    request(link, function (error1, response1, body1) {
                                        var _job = JSON.parse(body1);
                                        var job = {};
                                        if(error1) {
                                            console.log("Error: " + error1);
                                            fs.appendFileSync('message.txt', "\nError: " + error1);
                                            failureExecution(db,error1,mongoResult.insertedId);
                                        }else if(response1.statusCode === 200){
                                            db.collection("tags").find({}).toArray(function(err, savedTags) {
                                                if(err){
                                                    console.log(err);
                                                    db.close();
                                                }else{
                                                    var regex = new RegExp(_.map(savedTags,function (tag) {
                                                        return tag.name;
                                                    }).join("|"),"ig");
                                                    job['jobId'] = "mustakbil-"+_job.id;
                                                    job['jobSalary'] = {
                                                        min:Number(_job.salaryMin.replace(/[^\d]/g,'')),
                                                        max:Number(_job.salaryMax.replace(/[^\d]/g,''))
                                                    };
                                                    job['jobTags'] = UTILS.getTags(.trim());
                                                    job['jobDatePosted'] = (new Date($($($('.table-grid-bordered').children()['3']).children()['1']).html().trim())).getTime();
                                                    job['jobLocation'] = _.uniq($($($('.table-grid-bordered').children()['4']).children()['1']).text().trim().replace(/\r\n\s+/g,'').split(","));
                                                    job['jobContent'] = content;
                                                    job['jobUrl'] = link;
                                                    job['jobTitle'] = element.jobTitle;
                                                    job['jobProvider'] = element.jobProvider;
                                                    job['jobProviderLogo'] = element.image !== undefined ? 'http://www.mustakbil.com'+element.image : 'https://lh3.googleusercontent.com/i113bxHlU-Cq5SgB0BqNxDSUSIvYrRFq1MI9KvICFVdXcwbaRAVrN22-IexCaQEX9g=w300';
                                                    job['jobSource'] = 'mustakbil';
                                                    job['jobSourceLogo'] = 'https://lh3.googleusercontent.com/i113bxHlU-Cq5SgB0BqNxDSUSIvYrRFq1MI9KvICFVdXcwbaRAVrN22-IexCaQEX9g=w300';
                                                    job['shortDescription'] = element.jobShortDescription;
                                                    job['jobTags'] = UTILS.assembleTags(job['jobTags'],job['jobContent'].match(regex));
                                                    job['jobTags'] = UTILS.assembleTags(job['jobTags'],job['jobTitle'].match(regex));
                                                    client.index({
                                                        index:'jobgram',
                                                        id:job['jobId'],
                                                        type:'job',
                                                        body:job
                                                    },function (err,res,status) {
                                                        if(err){
                                                            console.log(err);
                                                            fs.appendFileSync('message.txt', '\nerror');
                                                            failureExecution(db,err,mongoResult.insertedId);
                                                        }else if(res){
                                                            console.log(res);
                                                            if(res.created){
                                                                tags = UTILS.assembleTags(tags,job['jobTags']);
                                                            }
                                                            fs.appendFileSync('message.txt', '\nres');
                                                        }else if(status){
                                                            console.log(status);
                                                            fs.appendFileSync('message.txt', '\nstatus');
                                                        }
                                                        callback();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                },function (err) {
                                    if(err) {
                                        failureExecution(db,err,mongoResult.insertedId);
                                    } else {
                                        console.log('done crawling : '+url);
                                        fs.appendFileSync('message.txt', '\ndone crawling : '+url);
                                        page+=1;
                                        if(page < 4){
                                            rootUrl.push('https://www.mustakbil.com/jobs/search/?page='+page);
                                        }
                                        callbackOuter(null,'all done');
                                    }

                                });
                            }
                        });
                    },
                    function (err,msg) {
                        if(err){
                            failureExecution(db,err,mongoResult.insertedId);
                        }else {
                            console.log(msg);
                            successExecution(db,mongoResult.insertedId);
                        }
                    }
                );
            }
        });
    }
});


