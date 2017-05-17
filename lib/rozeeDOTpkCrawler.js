var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

var jobs = [];
var fpn = 0;
var rootUrl = ['https://www.rozee.pk/job/jsearch/q/all/?fpn='+fpn];

async.eachSeries(rootUrl,function (url,callbackOuter) {
    console.log("On page : "+url);
    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
            return;
        }
        if(response.statusCode === 200) {
            // Parse the document body
            var $ = cheerio.load(body);
            var fullJobLinks = $('.full_link');
            console.log('Number of links retrieved for page : '+fullJobLinks.length);
            async.eachSeries(fullJobLinks,function (element,callback) {
                if($(element).attr('href')){
                    var link = $(element).attr('href').split("?")[0];
                    console.log('Scrapping : '+link);
                    request('http:'+link, function (error1, response1, body1) {
                        var job = {};
                        if(error1) {
                            console.log("Error: " + error);
                            return;
                        }
                        if(response1.statusCode === 200){
                            var $ = cheerio.load(body1);
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
                            job['fullURL'] = 'http:'+link;
                            job['title'] = $('[itemprop="title"]').text().trim();
                            job['hiringOrganization'] = $('[itemprop="hiringOrganization"]').text().trim();
                            job['jobLocation'] = _.uniq(_loc);
                            job['companyLogo'] = $('[alt="Company Logo"]').attr('src') ? $('[alt="Company Logo"]').attr('src').trim() : '';
                            job['datePosted'] = (new Date(datePosted - difference)).getTime();
                            job['content'] = '<div class="rozeeDOTpk-details">'+$($('.jblk')[0]).html()+$($('.jblk')[1]).html()+$($('.jblk')[2]).html()+'</div>';
                            if(salary !== 'Please Login to view salary' && salary.split('-')[0].match(/\d+/g)){
                                job['salary'] = {
                                    min:Number(salary.split('-')[0].replace(/[^\d]/g,'')),
                                    max:Number(salary.split('-')[1].replace(/[^\d]/g,''))
                                }
                            }
                            if(job.title !== ''  && job.hiringOrganization !== ''){
                                jobs.push(job);
                            }
                            callback();
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
                callbackOuter();
            });
        }
    });
},function (err) {
    if(err) throw err;
    console.log("finally done!!");
    return;
});