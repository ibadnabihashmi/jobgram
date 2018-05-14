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
                            page.open('https://jobtiv.com'+process.argv[2]).then(function (status) {
                                console.log('******************************************************************');
                                console.log('******************************************************************');
                                console.log('******************************************************************');
                                console.log(status);
                                page.property('content').then(function (content) {
                                    var $ = cheerio.load(content.toString());
                                    pageDone();
                                });
                            });
                        }, process.argv[3]);
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('DONE COMPLETED!!!');
                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                            phInstance.exit();
                        }
                    });
                });
            });
        });
    })
    .catch(error => {
        console.log(error);
        // failureExecution(db, error, phInstance, mongoResult.insertedId)
    });
    