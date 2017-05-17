var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

request('https://www.rozee.pk/wali-systems-inc-project-manager-lahore-jobs-613020.php', function (error1, response1, body1) {
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
        job['title'] = $('[itemprop="title"]').text().trim();
        job['hiringOrganization'] = $('[itemprop="hiringOrganization"]').text().trim();
        job['jobLocation'] = _.uniq(_loc);
        job['companyLogo'] = $('[alt="Company Logo"]').attr('src').trim();
        if(salary !== 'Please Login to view salary'){
            job['salary'] = {
                min:Number(salary.split('-')[0].replace(/[^\d]/g,'')),
                max:Number(salary.split('-')[1].replace(/[^\d]/g,''))
            }
        }
        console.log(job);
        return;
    }
});

// request('https://www.rozee.pk/job/jsearch/q/all', function(error, response, body) {
//     if(error) {
//         console.log("Error: " + error);
//         return;
//     }
//     if(response.statusCode === 200) {
//         // Parse the document body
//         var $ = cheerio.load(body);
//         var fullJobLinks = $('.full_link');
//         console.log('Number of links retrieved for page 1 : '+fullJobLinks.length);
//         async.eachSeries(fullJobLinks,function (element,callback) {
//             if($(element).attr('href')){
//                 var link = $(element).attr('href').split("?")[0];
//                 console.log('Scrapping : '+link);
//                 request('http:'+link, function (error1, response1, body1) {
//                     if(error1) {
//                         console.log("Error: " + error);
//                         return;
//                     }
//                     if(response1.statusCode === 200){
//                         $ = cheerio.load(body1);
//                         console.log($('title').text());
//                         callback();
//                     }
//                 });
//             }
//         },function (err) {
//             if(err) throw err;
//             console.log('done');
//             return;
//         });
//     }
// });