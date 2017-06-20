var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');
var client = require('../config/connection.js');

var page = 0;
var rootUrl = ['https://www.indeed.com.pk/jobs?l=Pakistan&sort=date&start='+page];

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
                return;
            }
            if(response.statusCode === 200) {
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
                                console.log("Error: " + error);
                                return;
                            }
                            if(response1.statusCode === 200){
                                var $ = cheerio.load(body1);
                                job['jobContent'] = '<div class="description">'+$('#job_summary').html()+'</div>';
                                job['shortDescription'] = element.jobShortDescription.trim().split(' ').splice(0,30).join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+/g,' ')+'.....';
                                job['jobDatePosted'] = Date.now();
                                job['jobLocation'] = element.jobLocation;
                                job['jobUrl'] = link;
                                job['jobTitle'] = element.jobTitle;
                                job['jobProvider'] = element.jobProvider;
                                job['jobProviderLogo'] = $('.cmp_logo_img').attr('src') ? $('.cmp_logo_img').attr('src') : 'https://d3fw5vlhllyvee.cloudfront.net/tophat/s/975c6f4/indeed.png';
                                job['jobId'] = element.jobId;
                                job['jobSource'] = 'indeed';
                                job['jobSourceLogo'] = 'https://d3fw5vlhllyvee.cloudfront.net/tophat/s/975c6f4/indeed.png';
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
                                        return
                                    }
                                    if(res){
                                        console.log(res);
                                    }
                                    if(status){
                                        console.log(status);
                                    }
                                    callback();
                                });
                            }
                        });
                    }
                },function (err) {
                    if(err) throw err;
                    console.log('done crawling : '+url);
                    page+=10;
                    if(page < 60){
                        rootUrl.push('https://www.indeed.com.pk/jobs?l=Pakistan&sort=date&start='+page);
                    }
                    callbackOuter(null,'all done');
                });
            }
        });
    },
    function (err,msg) {
        if(err) throw err;
        console.log(msg);
        return;
    }
);