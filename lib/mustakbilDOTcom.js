var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

request('https://www.mustakbil.com/jobs/search/?page=1', function (error, response, body) {
    if(error) {
        console.log("Error: " + error);
        return;
    }
    if(response.statusCode === 200){
        var $ = cheerio.load(body);
        var jobsList = [];
        $('.jobs-list > li').each(function (element) {
            jobsList.push({
                jobLink:$($($(this).children()['1']).children()['0']).attr('href'),
                jobTitle:$($($(this).children()['1']).children()['0']).text().trim(),
                jobProvider:$($($(this).children()['2']).children()['0']).text().trim(),
                image:$($($($($(this).children()['4'])).html()).children()['0']).attr('src')
            });
        });
        console.log(jobsList);
    }
});
