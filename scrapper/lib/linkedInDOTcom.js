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

function successExecution(db,phInstance,id) {
    db.collection('jobs').updateOne(
        {
            _id:id
        },{
            $set: {
                "end":Date.now(),
                "status":"completed"
            }
        },function (err,result) {
            if(err){
                console.log(err);
                db.close();
                phInstance.exit();
            }else{
                console.log('state updated');
                db.close();
                phInstance.exit();
            }
        });
}

function failureExecution(db,err,phInstance,id) {
    db.collection('jobs').updateOne(
        {
            _id:mongoResult.insertedId
        },{
            $set: {
                "end":Date.now(),
                "status":"failed",
                "logs": err.toString()
            }
        },function (err,result) {
            if(err){
                console.log(err);
                db.close();
                phInstance.exit();
            }else{
                console.log('state updated');
                db.close();
                phInstance.exit();
            }
        });
}

MongoClient.connect(url, function(err, db) {
    if(err){
        console.log(err);
        db.close();
    }else {
        db.collection('jobs').insertOne({
            "jobName":"linkedin",
            "start":Date.now(),
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
                                            'value'    : '"ajax:0743401093896612512"',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : true,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'RT',
                                            'value'    : 's=1495954211880&r=https%3A%2F%2Fwww.linkedin.com%2F',
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
                                            'value'    : 'GA1.2.2498185.1471514951',
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
                                            'value'    : 'CwEAAAFcyTPp_IL2j6WP_PGCnkGykFxteKbeNhYqC3pZfxd0IdCCm3iqzUKmqCGMKhxh9XxXh9-PRrFk_7RnmDN7Wbf20wNOq2TfGTMnPrOOTd5NIOZ0H-OoN5RkCKsDshML5m5qbWkkvh7DP-YSUxLt9apYXaMewiM9Zgg8LFPmrfCc87qHm7hdphOTb0QeE-2EHgkyXxRrQm6fhlIfErrGwBK_6HCmEDOVqdUlgBlmfBaIfhDN1SMVtnsg6V1lLqWBVG0m9PNbZTRuOjnBkjjuA-VVTqI3BERVbOf9NViuqW5MP4P6w5p0oCegwd9QMHL2mZX5vdbQCup6jF27zS_rJOR-Dhf_kuAqNg3EMlHsV90vZCz5edEsCWTP9N30ovaHY0mNXEbK9ONt',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'bcookie',
                                            'value'    : '"v=2&bdb240a5-3278-4b47-8832-d64dd6c6d98a"',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'bscookie',
                                            'value'    : '"v=1&20170512132337f87efcfe-188b-4969-8efd-314d2552bfe9AQFy9vluKwXFnuKdl5nWd4QBMXYD69F9"',
                                            'domain'   : '.www.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'lang',
                                            'value'    : 'v=2&lang=en-us',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : 'Session'
                                        },
                                        {
                                            'name'     : 'li_at',
                                            'value'    : 'AQEDARSoPqoERyadAAABXL87CPwAAAFcyq_sjVEAT0fWWph9ZqvaS91fxfh29qAxq5yb0lR13HqVPG5FurSheiM0_swmg5y-LggT6Ck_5-vybdCHVZjljR6T2wDCoSSsr-TnIaR0ESAWMxB673QsbqF9',
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
                                            'value'    : '"b=SB10:g=27:u=96:i=1498024271:t=1498028509:s=AQGGuWFImXkppm3pEcdl72aTNnL0aORN"',
                                            'domain'   : '.linkedin.com',
                                            'path'     : '/',
                                            'httponly' : false,
                                            'secure'   : false,
                                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                                        },
                                        {
                                            'name'     : 'sl',
                                            'value'    : '"v=1&DG61W"',
                                            'domain'   : '.www.linkedin.com',
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
                                            'value'    : 'B60NauDTD2G_SKkoJ.1473242243423.1479724461196.0000000000000001',
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
                                            var data = JSON.stringify(JSON.parse($('img')['7'].next.children[0].data),null,2);
                                            fs.writeFileSync('yolo1.json',data);
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
                                            fs.writeFileSync('yolo2.json',JSON.stringify(jobsList,null,2));
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
                                                        client.index({
                                                            index:'jobgram',
                                                            id:job['jobId'],
                                                            type:'job',
                                                            body:job
                                                        },function (err,res,status) {
                                                            if(err){
                                                                console.log(err);
                                                                failureExecution(db,err,phInstance,mongoResult.insertedId);
                                                            }
                                                            if(res){
                                                                console.log(res);
                                                            }
                                                            if(status){
                                                                console.log(status);
                                                            }
                                                            console.log("executed");
                                                            callback();
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
