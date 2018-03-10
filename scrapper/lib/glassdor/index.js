var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var phInstance = null;
var async = require('async');
var fs = require('fs');
var jobs = [];
var client = require('../../config/connection.js');
var MongoClient = require('mongodb').MongoClient;
var url = require('../../config/urls').mongo;
var UTILS = require('../utils');
var _ = require('underscore');

var tags = [];

function saveTags(db, phInstance) {
    async.eachSeries(tags, function (tag, callback) {
        UTILS.saveTags(db, tag, function (err, msg) {
            if (err) {
                callback(err);
            } else {
                console.info(msg);
                callback();
            }
        });
    }, function (err) {
        if (err) {
            console.error(err);
            db.close();
            phInstance.exit();
        } else {
            db.close();
            phInstance.exit();
        }
    });
}

function successExecution(db, phInstance, id) {
    db.collection('jobs').updateOne(
        {
            _id: id
        }, {
            $set: {
                "end": new Date(),
                "status": "completed"
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('state updated');
            }
            saveTags(db, phInstance);
        });
}

function failureExecution(db, err, phInstance, id) {
    db.collection('jobs').updateOne(
        {
            _id: id
        }, {
            $set: {
                "end": new Date(),
                "status": "failed",
                "logs": err.toString()
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('state updated');
            }
            saveTags(db, phInstance);
        });
}

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
        db.close();
    } else {
        db.collection('jobs').insertOne({
            "jobName": "glassdoor",
            "start": new Date(),
            "end": undefined,
            "status": "running",
            "logs": "clear :)"
        }, function (err, mongoResult) {
            if (err) {
                console.log(err);
                db.close();
            } else {
                console.log(mongoResult.insertedId);
                phantom.create()
                    .then(instance => {
                        console.log('created');
                        phInstance = instance;
                        return instance.createPage();
                    })
                    .then(page => {
                        page.setting('userAgent', 'Chrome/57.0.2987.133').then(function (userAgent) {
                            console.log(userAgent);
                            page.setting('javascriptEnabled', true).then(function () {
                                page.property('cookies',
                                    [
                                        // {
                                        //     'name'     : 'yolo',
                                        //     'value'    : 'yolo',
                                        //     'domain'   : '.linkedin.com',
                                        //     'path'     : '/',
                                        //     'httponly' : true,
                                        //     'secure'   : false,
                                        //     'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        // }
                                    ]
                                ).then(function () {
                                    var pages = ['1', '2', '3', '4', '5'];
                                    async.eachSeries(pages, function (pageNumber, pageDone) {
                                        console.log('Opening page .....' + pageNumber);
                                        setTimeout(function () {
                                            page.open('https://www.glassdoor.com/Job/pakistan-jobs-SRCH_IL.0,8_IN192_IP' + pageNumber + '.htm?fromAge=1').then(function (status) {
                                                console.log('******************************************************************');
                                                console.log('******************************************************************');
                                                console.log('******************************************************************');
                                                console.log(status);
                                                page.property('content').then(function (content) {
                                                    var $ = cheerio.load(content.toString());
                                                    var jobsList = [];
                                                    $('.jlGrid > li > .logoWrap > .jobLink').each(function (element) {
                                                        var url = 'https://www.glassdoor.com' + $(this).attr('href').toString();
                                                        var splittedurl = url.split('=');
                                                        jobsList.push({
                                                            id: splittedurl[splittedurl.length - 1],
                                                            jobLink: 'https://www.glassdoor.com' + $(this).attr('href').toString().trim(),
                                                        });
                                                    });
                                                    async.eachSeries(jobsList, function (list, callback) {
                                                        setTimeout(function () {
                                                            console.log('opening -------> ' + list.jobLink);
                                                            var job = {};
                                                            page.open(list.jobLink).then(function (status) {
                                                                console.log(status);
                                                                console.log('opening -------> ' + list.jobLink);
                                                                if (status === 'success') {
                                                                    page.property('content').then(function (content) {
                                                                        $ = cheerio.load(content.toString());
                                                                        var stringjob = $('script[type="application/ld+json"]').text().toString().trim()
                                                                            .replace(/\s/ig, " ")
                                                                            .replace(/&amp;/ig, '&')
                                                                            .replace(/&lt;/ig, '<')
                                                                            .replace(/&gt;/ig, '>')
                                                                            .replace(//ig, '')
                                                                            .replace(/<[^>]*>/ig, ' ');
                                                                        fs.writeFileSync('shit1.json', stringjob);
                                                                        var jsonjob = JSON.parse(stringjob);
                                                                        console.log("extracting ........");
                                                                        job['jobContent'] = jsonjob.description ? jsonjob.description : '';
                                                                        job['shortDescription'] = job['jobContent'].trim().split(' ').splice(0, 30).join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+/g, ' ') + '.....';
                                                                        job['jobDatePosted'] = jsonjob.datePosted ? new Date(jsonjob.datePosted) : '';
                                                                        job['jobLocation'] = jsonjob.jobLocation ? jsonjob.address ? jsonjob.addressLocality : '' : '';
                                                                        job['jobUrl'] = list.jobLink;
                                                                        job['jobTitle'] = jsonjob.title;
                                                                        job['jobProvider'] = jsonjob.hiringOrganization ? jsonjob.hiringOrganization.name : '';
                                                                        job['jobProviderLogo'] = jsonjob.image;
                                                                        job['jobId'] = 'glassdoor-' + list.id;
                                                                        job['jobSource'] = 'glassdoor';
                                                                        job['jobSourceLogo'] = 'https://media.glassdoor.com/brand-logo/logomark-square/glassdoor-social-icon.png';
                                                                        db.collection("tags").find({}).toArray(function (err, savedTags) {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                db.close();
                                                                            } else {
                                                                                var regex = new RegExp(_.map(savedTags, function (tag) {
                                                                                    return tag.name;
                                                                                }).join("|"), "ig");
                                                                                job['jobTags'] = UTILS.assembleTags(job['jobTitle'].match(regex), job['jobContent'].match(regex));
                                                                                client.index({
                                                                                    index: 'jobgram',
                                                                                    id: job['jobId'],
                                                                                    type: 'job',
                                                                                    body: job
                                                                                }, function (err, res, status) {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        failureExecution(db, err, phInstance, mongoResult.insertedId);
                                                                                    } else if (res) {
                                                                                        console.log(res);
                                                                                        if (res.created) {
                                                                                            tags = UTILS.assembleTags(tags, job['jobTags']);
                                                                                        }
                                                                                    } else if (status) {
                                                                                        console.log(status);
                                                                                    }
                                                                                    console.log("executed");
                                                                                    callback();
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                } else {
                                                                    callback()
                                                                }
                                                            });
                                                        }, 5000);
                                                    }, function (err) {
                                                        if (err) {
                                                            console.log(err);
                                                            failureExecution(db, err, phInstance, mongoResult.insertedId)
                                                        } else {
                                                            console.log('done with this page');
                                                            pageDone();
                                                        }
                                                    });
                                                });
                                            });
                                        }, 5000);
                                    }, function (err) {
                                        if (err) {
                                            console.log(err);
                                            failureExecution(db, err, phInstance, mongoResult.insertedId);
                                        } else {
                                            console.log('DONE COMPLETED!!!');
                                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                                            successExecution(db, phInstance, mongoResult.insertedId)
                                        }
                                    });
                                });
                            });
                        });

                        // use page
                    })
                    .catch(error => {
                        console.log(error);
                        failureExecution(db, error, phInstance, mongoResult.insertedId)
                    });

            }
        });
    }
});
