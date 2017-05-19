/**
 * Created by ehashmi on 5/19/17.
 */
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

var jobs = [];
var page = 2;
var rootUrl = ['https://www.mustakbil.com/jobs/search/?page='+page];

// request('http://www.bayrozgar.com/advance_search/page_1/', function (error1, response1, body1) {
//     var job = {};
//     if(error1) {
//         console.log("Error: " + error);
//         return;
//     }
//     if(response1.statusCode === 200){
//         var $ = cheerio.load(body1);
//         var jobsList = [];
//         $('.b_light_yel').each(function (element) {
//             jobsList.push({
//                 jobLink:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).attr('href'),
//                 jobTitle:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).text().trim(),
//                 datePosted:(new Date($($(this).children()['1']).text().trim())).getTime(),
//                 jobLocation:$($(this).children()['2']).text().trim(),
//                 jobProvider:$($(this).children()['3']).text().trim()
//             });
//         });
//         console.log(jobsList);
//     }
// });

request('http://www.bayrozgar.com/Information-Technologies-(IT)---Software-Jobs/Senior-PHP-Developer-79704.html', function (error1, response1, body1) {
    var job = {};
    if(error1) {
        console.log("Error: " + error);
        return;
    }
    if(response1.statusCode === 200){
        var $ = cheerio.load(body1);
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
        console.log(jobsList);
    }
});

// async.whilst(
//     function () {
//         return rootUrl.length !== 0;
//     },
//     function (callbackOuter) {
//         var url = rootUrl.pop();
//         console.log("==========================================================");
//         console.log("On page : "+url);
//         console.log("==========================================================");
//         request(url, function(error, response, body) {
//             if(error) {
//                 console.log("Error: " + error);
//                 return;
//             }
//             if(response.statusCode === 200) {
//                 // Parse the document body
//                 var $ = cheerio.load(body);
//                 var jobsList = [];
//                 $('.jobs-list > li').each(function (element) {
//                     jobsList.push({
//                         jobLink:$($($(this).children()['1']).children()['0']).attr('href'),
//                         jobTitle:$($($(this).children()['1']).children()['0']).text().trim(),
//                         jobProvider:$($($(this).children()['2']).children()['0']).text().trim(),
//                         image:$($(this).children()['4']).children().length ? $($($($($(this).children()['4'])).html()).children()['0']).attr('src') : ''
//                     });
//                 });
//                 console.log('Number of links retrieved for page : '+jobsList.length);
//                 async.eachSeries(jobsList,function (element,callback) {
//                     if(element.jobLink){
//                         var link = 'https://www.mustakbil.com'+element.jobLink;
//                         console.log('Scrapping : '+link);
//                         request(link, function (error1, response1, body1) {
//                             var job = {};
//                             if(error1) {
//                                 console.log("Error: " + error);
//                                 return;
//                             }
//                             if(response1.statusCode === 200){
//                                 var $ = cheerio.load(body1);
//                                 var salary = $('.list-columns > .last').text().trim().split("-");
//                                 job['salary'] = {
//                                     min:Number(salary[0].replace(/[^\d]/g,'')),
//                                     max:Number(salary[1].replace(/[^\d]/g,''))
//                                 };
//                                 var content = '<div class="rozeeDOTpk-details">';
//                                 if($('.table-grid-bordered').next().html() === 'Description'){
//                                     content+='<h3 class="mb10">Description</h3><div class="lh20">'+$('.table-grid-bordered').next().next().html()+'</div>';
//                                 }
//                                 if($('.table-grid-bordered').next().next().next().html() === 'Specification'){
//                                     content+='<h3 class="mb10">Specification</h3><div class="lh20">'+$('.table-grid-bordered').next().next().next().next().html()+'</div>';
//                                 }
//                                 content+='</div>';
//                                 job['datePosted'] = (new Date($($($('.table-grid-bordered').children()['3']).children()['1']).html().trim())).getTime();
//                                 job['jobLocation'] = _.uniq($($($('.table-grid-bordered').children()['4']).children()['1']).text().trim().replace(/\r\n\s+/g,'').split(","));
//                                 job['content'] = content;
//                                 job['fullURL'] = link;
//                                 job['title'] = element.jobTitle;
//                                 job['hiringOrganization'] = element.jobProvider;
//                                 job['companyLogo'] = element.image;
//                                 jobs.push(job);
//                                 callback();
//                             }
//                         });
//                     }
//                 },function (err) {
//                     if(err) throw err;
//                     console.log('done crawling : '+url);
//                     page+=1;
//                     if(page < 4){
//                         rootUrl.push('https://www.mustakbil.com/jobs/search/?page='+page);
//                     }
//                     callbackOuter(null,'all done');
//                 });
//             }
//         });
//     },
//     function (err,msg) {
//         if(err) throw err;
//         console.log(msg);
//         var fs = require('fs');
//         fs.writeFileSync('lol.json',JSON.stringify(jobs,null,2));
//         return;
//     }
// );