var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

var page = 0;
var rootUrl = ['http://www.bayrozgar.com/advance_search/page_'+page+'/'];

request('https://www.indeed.com.pk/jobs?l=Pakistan&sort=date&start=0', function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
        return;
    }
    if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);

        var fs = require('fs');
        fs.writeFileSync('someFuck.html',body);
        console.log($('body').html());
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
//                 $('.b_light_yel').each(function (element) {
//                     jobsList.push({
//                         jobLink:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).attr('href'),
//                         jobTitle:$($($($($($(this).children()['0']).children()['0']).children()['0']).children()['0']).children()['0']).text().trim(),
//                         datePosted:(new Date($($(this).children()['1']).text().trim())).getTime(),
//                         jobLocation:$($(this).children()['2']).text().trim(),
//                         jobProvider:$($(this).children()['3']).text().trim()
//                     });
//                 });
//                 console.log('Number of links retrieved for page : '+jobsList.length);
//                 async.eachSeries(jobsList,function (element,callback) {
//                     if(element.jobLink){
//                         var link = element.jobLink;
//                         console.log('Scrapping : '+link);
//                         request(link, function (error1, response1, body1) {
//                             var job = {};
//                             if(error1) {
//                                 console.log("Error: " + error);
//                                 return;
//                             }
//                             if(response1.statusCode === 200){
//                                 var $ = cheerio.load(body1);
//                                 var id = link.split(".");
//                                 id = id[id.length-2].split("-");
//                                 id = id[id.length-1];
//                                 var salary;
//                                 $('td').each(function (element) {
//                                     if($(this).text().trim() === 'Salary Range:'){
//                                         salary = $(this).next().text().trim().split("To");
//                                         job['jobSalary'] = {
//                                             min:Number(salary[0].replace(/[^\d]/g,'')),
//                                             max:Number(salary[1].replace(/[^\d]/g,''))
//                                         }
//                                     }
//                                 });
//                                 var content = '<div class="bayrozgarDOTcom-details">';
//                                 $('.job_head2_s').each(function (element) {
//                                     if($(this).text().trim() === 'Job Description:'){
//                                         content += '<div class="job_head2_s">Job Description</div>';
//                                         content += '<div class="job-summary">'+$(this).next().html()+'</div>';
//                                     }
//                                     if($(this).text().trim() === 'Skills Required:'){
//                                         content += '<div class="job_head2_s">Skills Required</div>';
//                                         content += '<div class="job-summary">'+$(this).next().html()+'</div>';
//                                     }
//                                 });
//                                 content += '</div>';
//                                 job['jobContent'] = content;
//                                 job['jobDatePosted'] = element.datePosted;
//                                 job['jobLocation'] = [element.jobLocation];
//                                 job['jobUrl'] = link;
//                                 job['jobTitle'] = element.jobTitle;
//                                 job['jobProvider'] = element.jobProvider;
//                                 job['jobProviderLogo'] = $('.new_img > div > a > img').attr('src');
//                                 job['jobId'] = 'bayrozgar-'+id;
//                                 job['jobSource'] = 'bayrozgar';
//                                 client.index({
//                                     index:'jobgram',
//                                     id:job['jobId'],
//                                     type:'job',
//                                     body:job
//                                 },function (err,res,status) {
//                                     if(err){
//                                         console.log(err);
//                                         return
//                                     }
//                                     if(res){
//                                         console.log(res);
//                                     }
//                                     if(status){
//                                         console.log(status);
//                                     }
//                                     callback();
//                                 });
//                             }
//                         });
//                     }
//                 },function (err) {
//                     if(err) throw err;
//                     console.log('done crawling : '+url);
//                     page+=1;
//                     if(page < 4){
//                         rootUrl.push('http://www.bayrozgar.com/advance_search/page_'+page+'/');
//                     }
//                     callbackOuter(null,'all done');
//                 });
//             }
//         });
//     },
//     function (err,msg) {
//         if(err) throw err;
//         console.log(msg);
//         return;
//     }
// );