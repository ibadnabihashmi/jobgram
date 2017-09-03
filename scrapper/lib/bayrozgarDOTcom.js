var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');
var client = require('../config/connection.js');
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/urls').mongo;
var UTILS = require('./utils');

var page = 1;
var rootUrl = ['http://www.bayrozgar.com/advance_search/page_'+page+'/'];
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
            "jobName":"bayrozgar",
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
                                $('.b_light_yel').each(function (element) {
                                    jobsList.push({
                                        jobLink:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).attr('href'),
                                        jobTitle:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).text().trim(),
                                        datePosted:(new Date($($(this).children()['1']).text().trim())).getTime(),
                                        jobLocation:$($(this).children()['2']).text().trim(),
                                        jobProvider:$($(this).children()['3']).text().trim()
                                    });
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
                                            }
                                            if(response1.statusCode === 200){
                                                var $ = cheerio.load(body1);
                                                var id = link.split(".");
                                                id = id[id.length-2].split("-");
                                                id = id[id.length-1];
                                                var salary;
                                                $('td').each(function (element) {
                                                    if($(this).text().trim() === 'Salary Range:'){
                                                        salary = $(this).next().text().trim().split("To");
                                                        job['jobSalary'] = {
                                                            min:Number(salary[0].replace(/[^\d]/g,'')),
                                                            max:Number(salary[1].replace(/[^\d]/g,''))
                                                        }
                                                    }
                                                });
                                                var content = '<div class="bayrozgarDOTcom-details">';
                                                $('.job_head2_s').each(function (element) {
                                                    if($(this).text().trim() === 'Job Description:'){
                                                        content += '<div class="job_head2_s">Job Description</div>';
                                                        content += '<div class="job-summary">'+$(this).next().html()+'</div>';
                                                        job['shortDescription'] = $(this).next().text().trim().split(' ').splice(0,30).join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+/g,' ')+'.....';
                                                    }
                                                    if($(this).text().trim() === 'Skills Required:'){
                                                        content += '<div class="job_head2_s">Skills Required</div>';
                                                        content += '<div class="job-summary">'+$(this).next().html()+'</div>';
                                                    }
                                                });
                                                content += '</div>';
                                                db.collection("tags").find({}).toArray(function(err, savedTags) {
                                                    if(err){
                                                        console.log(err);
                                                        db.close();
                                                    }else{
                                                        var regex = new RegExp(_.map(savedTags,function (tag) {
                                                            return tag.name;
                                                        }).join("|"),"ig");
                                                        job['jobContent'] = content;
                                                        job['jobTags'] = UTILS.assembleTags(
                                                            UTILS.getTags($('[itemprop="occupationalCategory"]').text().trim()),
                                                            UTILS.getTags($('[itemprop="industry"]').text().trim())
                                                        );
                                                        job['jobDatePosted'] = element.datePosted;
                                                        job['jobLocation'] = [element.jobLocation];
                                                        job['jobUrl'] = link;
                                                        job['jobTitle'] = element.jobTitle;
                                                        job['jobProvider'] = element.jobProvider;
                                                        job['jobProviderLogo'] = $('.new_img > div > a > img').attr('src');
                                                        job['jobId'] = 'bayrozgar-'+id;
                                                        job['jobSource'] = 'bayrozgar';
                                                        job['jobSourceLogo'] = 'http://www.bayrozgar.com/images/logo.jpg';
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
                                                                failureExecution(db,err,mongoResult.insertedId);
                                                            }
                                                            if(res){
                                                                console.log(res);
                                                                if(res.created){
                                                                    tags = UTILS.assembleTags(tags,job['jobTags']);
                                                                }
                                                            }
                                                            if(status){
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
                                    if(err) failureExecution(db,err,mongoResult.insertedId);
                                    console.log('done crawling : '+url);
                                    page+=1;
                                    if(page < 2){
                                        rootUrl.push('http://www.bayrozgar.com/advance_search/page_'+page+'/');
                                    }
                                    callbackOuter(null,'all done');
                                });
                            }
                        });
                    },
                    function (err,msg) {
                        if(err) failureExecution(db,err,mongoResult.insertedId);

                        console.log(msg);
                        successExecution(db,mongoResult.insertedId);
                    }
                );
            }
        });
    }
});

