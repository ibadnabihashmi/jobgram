var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');
var client = require('../../config/connection.js');
var MongoClient = require('mongodb').MongoClient;
var url = require('../../config/urls').mongo;
var UTILS = require('../utils');

var page = 0;
var rootUrl = ['https://www.indeed.com.pk/jobs?l=Pakistan&sort=date&start='+page];
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
            "jobName":"indeed",
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
                        request(url, function(error, response, body) {
                            if(error) {
                                console.log("Error: " + error);
                                failureExecution(db,error,mongoResult.insertedId);
                            }else if(response.statusCode === 200) {
                                // Parse the document body
                                var $ = cheerio.load(body);
                                var jobsList = [];
                                $('.result').each(function () {
                                    var _$ = cheerio.load($(this).html());
                                    var link = _$('[itemprop="title"]').attr('href');

                                    if(link && link.split('/')[1] === 'company'){
                                        var _job = {
                                            jobLink: 'http://www.indeed.com.pk'+link,
                                            jobTitle: _$('[itemprop="title"]').attr('title'),
                                            jobId: 'indeed-'+$(this).attr('data-jk'),
                                            jobProvider: _$('[itemprop="hiringOrganization"]').text().trim(),
                                            jobLocation: [_$('[itemprop="addressLocality"]').text().trim()],
                                            jobShortDescription:$('[itemprop="description"]').text().trim()
                                        };
                                        var salary = _$('.snip > .no-wrap').text().trim();
                                        if(salary){
                                            salary = salary.split('-');
                                            if(salary.length === 2){
                                                salary = {
                                                    min:Number(salary[0].replace(/[^\d]/g,'')),
                                                    max:Number(salary[1].replace(/[^\d]/g,''))
                                                }
                                            }else{
                                                salary = {
                                                    min:0,
                                                    max:Number(salary[0].replace(/[^\d]/g,''))
                                                }
                                            }
                                            _job.jobSalary = salary;
                                        }
                                        jobsList.push(_job);
                                    }
                                });
                                console.log('Number of links retrieved for page : '+jobsList.length);
                                async.eachSeries(jobsList,function (element,callback) {
                                    if(element.jobLink){
                                        var link = element.jobLink;
                                        console.log('Scrapping : '+link);
                                        request(link, function (error1, response1, body1) {
                                            var job = {};
                                            if(error1) {
                                                console.log("Error: " + error1);
                                                failureExecution(db,error1,mongoResult.insertedId);
                                            }else if(response1.statusCode === 200){
                                                var $ = cheerio.load(body1);
                                                db.collection("tags").find({}).toArray(function(err, savedTags) {
                                                    if(err){
                                                        console.log(err);
                                                        db.close();
                                                    }else{
                                                        var regex = new RegExp(_.map(savedTags,function (tag) {
                                                            return tag.name;
                                                        }).join("|"),"ig");
                                                        job['jobContent'] = '<div class="description">'+$('#job_summary').html()+'</div>';
                                                        job['shortDescription'] = element.jobShortDescription.trim().split(' ').splice(0,30).join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+/g,' ')+'.....';
                                                        job['jobDatePosted'] = (new Date()).getTime();
                                                        job['jobLocation'] = element.jobLocation;
                                                        job['jobUrl'] = link;
                                                        job['jobTitle'] = element.jobTitle;
                                                        job['jobProvider'] = element.jobProvider;
                                                        job['jobProviderLogo'] = $('.cmp_logo_img').attr('src') ? $('.cmp_logo_img').attr('src') : 'https://d3fw5vlhllyvee.cloudfront.net/tophat/s/975c6f4/indeed.png';
                                                        job['jobId'] = element.jobId;
                                                        job['jobSource'] = 'indeed';
                                                        job['jobSourceLogo'] = 'https://d3fw5vlhllyvee.cloudfront.net/tophat/s/975c6f4/indeed.png';
                                                        job['jobTags'] = UTILS.assembleTags([],job['jobContent'].match(regex));
                                                        job['jobTags'] = UTILS.assembleTags([],job['jobTitle'].match(regex));
                                                        if(element.jobSalary){
                                                            job['jobSalary'] = element.jobSalary;
                                                        }
                                                        client.index({
                                                            index:'jobgram',
                                                            id:job['jobId'],
                                                            type:'job',
                                                            body:job
                                                        },function (err,res,status) {
                                                            if(err){
                                                                console.log(err);
                                                                failureExecution(db,err,mongoResult.insertedId);
                                                            }else if(res){
                                                                console.log(res);
                                                                if(res.created){
                                                                    tags = UTILS.assembleTags(tags,job['jobTags']);
                                                                }
                                                            }else if(status){
                                                                console.log(status);
                                                            }
                                                            callback();
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                },function (err) {
                                    if(err) {
                                        failureExecution(db,err,mongoResult.insertedId);
                                    }else {
                                        console.log('done crawling : '+url);
                                        page+=10;
                                        if(page < 60){
                                            rootUrl.push('https://www.indeed.com.pk/jobs?l=Pakistan&sort=date&start='+page);
                                        }
                                        callbackOuter(null,'all done');
                                    }
                                });
                            }
                        });
                    },
                    function (err,msg) {
                        if(err) {
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
