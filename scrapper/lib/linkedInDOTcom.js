var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var phInstance = null;
var async = require('async');
var fs = require('fs');
var jobs = [];
var client = require('../config/connection.js');
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/urls').mongo;
var UTILS = require('./utils');
var _ = require('underscore');

var tags = [];

function saveTags(db,phInstance) {
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
            phInstance.exit();
        }else{
            db.close();
            phInstance.exit();
        }
    });
}

function successExecution(db,phInstance,id) {
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
            saveTags(db,phInstance);
        });
}

function failureExecution(db,err,phInstance,id) {
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
            saveTags(db,phInstance);
        });
}

MongoClient.connect(url, function(err, db) {
    if(err){
        console.log(err);
        db.close();
    }else {
        db.collection('jobs').insertOne({
            "jobName":"linkedin",
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
                phantom.create()
                    .then(instance => {
                        console.log('created');
                        phInstance = instance;
                        return instance.createPage();
                    })
                    .then(page => {
                        page.setting('userAgent','Chrome/57.0.2987.133').then(function (userAgent) {
                            console.log(userAgent);
                            page.setting('javascriptEnabled',true).then(function () {
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
                                        {
                                            'name'     : 'CP1',
                                            'value'    : '1',
                                            'domain'   : '.scorecardresearch.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'CP3',
                                            'value'    : '1',
                                            'domain'   : '.scorecardresearch.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'CP1',
                                            'value'    : '1',
                                            'domain'   : '.scorecardresearch.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'JSESSIONID',
                                            'value'    : '"ajax:2335886841055819240"',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : true,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'RT',
                                            'value'    : 's=1503158146889&r=https%3A%2F%2Fwww.linkedin.com%2Fuas%2Flogin%3Fgoback%3D%26trk%3Dhb_signin',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'UID',
                                            'value'    : '18D11093a2335aafefdae8g1472502970',
                                            'domain'   : '.scorecardresearch.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'UIDR',
                                            'value'    : '1472502970',
                                            'domain'   : '.scorecardresearch.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '__utma',
                                            'value'    : '226841088.446100211.1472762252.1475072730.1490031982.2',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '__utmz',
                                            'value'    : '226841088.1490031982.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '_ga',
                                            'value'    : 'GA1.2.446100211.1472762252',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '_gat',
                                            'value'    : '1',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '_lipt',
                                            'value'    : 'CwEAAAFd-zWrdGBuiRklo1M7SbznfgjW5tZcASHpXQ7rSDcd19jI0IvqXTBPAC_IkSXsARVbEBx2MvusrztLATAO2aWQVBrAxDq-c-dFqljdtCQXXbpdWmltnc8qxgj7SnllIHo4r36osi1Xq7LGxWc5PVWV1CtoYyZ3SrZma02oDa-UW2hsfqJMhOgnLwEMQ-nO_e2vJ1KCqZYVf27PTl_jz__A8I2yFEheXX-GDTfNGTmRHCeDuETE2aw14NmWy-At2rEq-2fu9X_YoJQtIc_Jwmbi9pQfVwxCLpbPhAONl2hbyXtLezPG9cWI1tAe8N_xGfwo9GfZc9wGrPowRz61SGcQ0ZGxYWk43nuLZDwmyiRd-qye-QsntheWUk5CucOp1UdD1PX9MFrFHm41HjWqlxStLa6LHycAe6cVndGT69Yct_rU-1yXpkmwsDwvu4v9K64vIPnHOmU',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'bcookie',
                                            'value'    : '"v=2&d6f567f2-dc5a-49d3-842c-ba4ea9c87a02"',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'bscookie',
                                            'value'    : '"v=1&201705130557293709094e-0bda-4a94-86a4-2c8410e2d39bAQGlRAYp3gPMTOKCD4CWT8FIXcotF-eb"',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'lang',
                                            'value'    : '"v=2&lang=en-us"',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : 'Session'
                                        },
                                        {
                                            'name'     : 'li_at',
                                            'value'    : 'AQEDARSoPqoA5NRVAAABXfs1FSUAAAFeH0GZJVEAwZJOEtcp2eATE5UsE0J8WWqtCbseztGifGQ0zONeqdloOJiM0_O1jc3ZqTnsCnLCP6k3wYWXmrAqa03oxPE4smDnojjzBHnz9h_-q4YQqspl2DiK',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'liap',
                                            'value'    : true,
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'lidc',
                                            'value'    : '"b=SB10:g=36:u=117:i=1503158193:t=1503241197:s=AQElzrUCyg8KK0sQDy96JUcZ2Ccvj8kp"',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'sl',
                                            'value'    : '"v=1&OpDbF"',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'sdsc',
                                            'value'    : '22%3A1%2C1503158154714%7ECONN%2C0wlVaisTWihRJg7nHJNfIi5rwWQs%3D',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'visit',
                                            'value'    : '"v=1&M"',
                                            'domain'   : 'www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'SID',
                                            'value'    : '1819f367-f47c-446b-97d3-bec07ca8dcc3',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'VID',
                                            'value'    : 'V_2017_05_23_03_1272',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '_chartbeat2',
                                            'value'    : 'COM8QSCOh6jZ4G7P.1497717860744.1502701497098.0000000000000001',
                                            'domain'   : 'www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : '_cb_ls',
                                            'value'    : '1',
                                            'domain'   : 'www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        }
                                    ]
                                ).then(function () {
                                    console.log('Opening page .....');
                                    page.open('https://www.linkedin.com/jobs/search/?locationId=pk%3A0&sortBy=DD&start=0').then(function (status) {
                                        console.log(status);
                                        page.property('content').then(function (content) {
                                            var $ = cheerio.load(content.toString());
                                            var data = JSON.stringify(JSON.parse($('img')['6'].next.children[0].data),null,2);
                                            var jobsList = [];
                                            JSON.parse(data).elements.forEach(function (element) {
                                                var id = element.hitInfo['com.linkedin.voyager.search.SearchJobJserp'].jobPosting.split(':');
                                                id = id[id.length-1];
                                                jobsList.push({
                                                    id:id,
                                                    jobLink:'https://www.linkedin.com/jobs/view/'+id,
                                                    jobTitle:element.hitInfo['com.linkedin.voyager.search.SearchJobJserp'].jobPostingResolutionResult.title,
                                                    datePosted:element.hitInfo['com.linkedin.voyager.search.SearchJobJserp'].jobPostingResolutionResult.listedAt,
                                                    jobLocation:element.hitInfo['com.linkedin.voyager.search.SearchJobJserp'].jobPostingResolutionResult.formattedLocation.replace(/\s/ig,'').split(',')
                                                });
                                            });
                                            async.eachSeries(jobsList,function (list,callback) {
                                                console.log('openeing -------> '+list.jobLink);
                                                page.open(list.jobLink).then(function (status) {
                                                    console.log(status);
                                                    console.log('opening -------> '+list.jobLink);
                                                    page.property('content').then(function (content) {
                                                        $ = cheerio.load(content.toString());
                                                        var job = {};
                                                        $('img').each(function () {
                                                            try {
                                                                var data = JSON.parse($(this).next().text());
                                                                if(data.hasOwnProperty('companyDetails')){
                                                                    console.log("extracting ........");
                                                                    job['jobContent'] = data.description.text;
                                                                    job['shortDescription'] = data.description.text.trim().split(' ').splice(0,30).join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+/g,' ')+'.....';
                                                                    job['jobDatePosted'] = list.datePosted;
                                                                    job['jobLocation'] = list.jobLocation;
                                                                    job['jobUrl'] = list.jobLink;
                                                                    job['jobTitle'] = list.jobTitle;
                                                                    job['jobProvider'] = data.companyDetails["com.linkedin.voyager.jobs.JobPostingCompany"].companyResolutionResult.name;
                                                                    job['jobProviderLogo'] = 'https://media.licdn.com/mpr/mpr/shrink_200_200'+data.companyDetails["com.linkedin.voyager.jobs.JobPostingCompany"].companyResolutionResult.logo.image["com.linkedin.voyager.common.MediaProcessorImage"].id;
                                                                    job['jobId'] = 'linkedin-'+list.id;
                                                                    job['jobSource'] = 'linkedin';
                                                                    job['jobSourceLogo'] = 'http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png';
                                                                }
                                                            } catch (e) {
                                                                console.log("exception thrown");
                                                            }

                                                        });
                                                        db.collection("tags").find({}).toArray(function(err, savedTags) {
                                                            if(err){
                                                                console.log(err);
                                                                db.close();
                                                            }else{
                                                                var regex = new RegExp(_.map(savedTags,function (tag) {
                                                                    return tag.name;
                                                                }).join("|"),"ig");
                                                                job['jobTags'] = UTILS.assembleTags(job['jobTitle'].match(regex),job['jobContent'].match(regex));
                                                                client.index({
                                                                    index:'jobgram',
                                                                    id:job['jobId'],
                                                                    type:'job',
                                                                    body:job
                                                                },function (err,res,status) {
                                                                    if(err){
                                                                        console.log(err);
                                                                        failureExecution(db,err,phInstance,mongoResult.insertedId);
                                                                    }else if(res){
                                                                        console.log(res);
                                                                        if(res.created){
                                                                            tags = UTILS.assembleTags(tags,job['jobTags']);
                                                                        }
                                                                    }else if(status){
                                                                        console.log(status);
                                                                    }
                                                                    console.log("executed");
                                                                    callback();
                                                                });
                                                            }
                                                        });
                                                    });
                                                });
                                            },function (err) {
                                                if(err){
                                                    console.log(err);
                                                    failureExecution(db,err,phInstance,mongoResult.insertedId)
                                                }else{
                                                    console.log('done!');
                                                    console.log('waiting....');
                                                    successExecution(db,phInstance,mongoResult.insertedId)
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });

                        // use page
                    })
                    .catch(error => {
                        console.log(error);
                        failureExecution(db,error,phInstance,mongoResult.insertedId)
                    });

            }
        });
    }
});
