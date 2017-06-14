var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');
var client = require('../config/connection.js');

var fpn = 0;
var rootUrl = ['https://www.rozee.pk/job/jsearch/q/all/?fpn='+fpn];

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
                var jobslist = [];
                $('.jobt > h3 > a').each(function (element) {
                    jobslist.push({
                        link:$(this).attr('href'),
                        class:$(this).parent().parent().parent().parent().parent().attr('class').match(/sponsored/ig)
                    });
                });
                console.log('Number of links retrieved for page : '+jobslist.length);
                async.eachSeries(jobslist,function (element,callback) {
                    if(element.link){
                        var link = element.link.split("?")[0];
                        console.log('Scrapping : '+link);
                        request('http:'+link, function (error1, response1, body1) {
                            var job = {};
                            if(error1) {
                                console.log("Error: " + error);
                                return;
                            }
                            if(response1.statusCode === 200){
                                var $ = cheerio.load(body1);
                                var id = link.split(".");
                                id = id[id.length-2].split("-");
                                id = id[id.length-1];
                                var salary = $($('.rz-salary').parent()).text().trim().split("\n")[0];
                                var locations = $('[itemprop="jobLocation"]').children();
                                var _loc = [];
                                for(var i=0;i<Object.keys(locations).length;i++){
                                    if($(locations[i]).text().trim()){
                                        _loc.push($(locations[i]).text().trim().replace(/[^\w]/g,''));
                                    }
                                }
                                var time = $($('.rz-calendar').parent()).text().trim().split(' ');
                                var datePosted = Number((new Date($('[itemprop="datePosted"]').text().trim())).getTime());
                                var difference = 0;
                                if(time.length > 2){
                                    if(time[2].match(/minute/ig)){
                                        difference = Number(time[1])*60*1000;
                                    }else if(time[2].match(/hour/ig)){
                                        difference = Number(time[1])*60*60*1000;
                                    }
                                }else{
                                    console.log(time.join(' '));
                                }
                                job['jobUrl'] = 'http:'+link;
                                job['jobTitle'] = $('[itemprop="title"]').text().trim();
                                job['jobProvider'] = $('[itemprop="hiringOrganization"]').text().trim();
                                job['jobLocation'] = _.uniq(_loc);
                                job['jobProviderLogo'] = $('[alt="Company Logo"]').attr('src') ? $('[alt="Company Logo"]').attr('src').trim() : '';
                                job['jobDatePosted'] = (new Date(datePosted - difference)).getTime();
                                job['jobContent'] = '<div class="rozeeDOTpk-details">'+$($('.jblk')[0]).html()+$($('.jblk')[1]).html()+$($('.jblk')[2]).html()+'</div>';
                                job['jobId'] = "rozee-"+id;
                                job['jobSource'] = "rozee";
                                if(salary !== 'Please Login to view salary' && salary.split('-')[0].match(/\d+/g)){
                                    job['jobSalary'] = {
                                        min:Number(salary.split('-')[0].replace(/[^\d]/g,'')),
                                        max:Number(salary.split('-')[1].replace(/[^\d]/g,''))
                                    }
                                }
                                if(job.title !== ''  && job.hiringOrganization !== ''){
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
                            }
                        });
                    }
                },function (err) {
                    if(err) throw err;
                    console.log('done crawling : '+url);
                    fpn+=20;
                    if(fpn < 60){
                        rootUrl.push('https://www.rozee.pk/job/jsearch/q/all/?fpn='+fpn);
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

