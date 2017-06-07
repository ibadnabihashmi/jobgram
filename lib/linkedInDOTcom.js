var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var phInstance = null;
var async = require('async');
var fs = require('fs');
var jobs = [];

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
                            'value'    : '"ajax:4123563552517787317"',
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
                            'value'    : 'CwEAAAFcTdKyPf47t6CiiMtsme4xfPqj20Xe3Pq9DG-04rPsYg9dHx7ntrD9kC71dLKxeBKVS8bdXuqur6xOG_l3-RiwX8Sw9B4dTxA_nTmn9xsHDhURX-8-3xLRs-EB1v2BAX-E4BgVgq_lk8LS2WKnhQfYqwgy3H91p85zEDLxigQRtNXBJWBzUby8iw-x7OnK6HOkDLS5RPidFbuWRVUfzzasVSYNiAXXPIIEkVZ4-kPleWEP8B3cqA-IMCryA2Y2YOsMmURqF7dijZ4S0SeCtMmB99PYHQhaY8FSE0_brCKs-09sFMqfP1d3WjtDg8N4U5meXQdkk59A9bGvtIqF4kntraKnv9jJcJHNWJof6vc-2QdDpyDW2kdQoqhEESrQ3k68nbTauCcCupCFMKnoTowUvrStqiXP',
                            'domain'   : '.linkedin.com',
                            'path'     : '/',
                            'httponly' : false,
                            'secure'   : false,
                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                        },
                        {
                            'name'     : '_lipt',
                            'value'    : 'CwEAAAFcTdKyPf47t6CiiMtsme4xfPqj20Xe3Pq9DG-04rPsYg9dHx7ntrD9kC71dLKxeBKVS8bdXuqur6xOG_l3-RiwX8Sw9B4dTxA_nTmn9xsHDhURX-8-3xLRs-EB1v2BAX-E4BgVgq_lk8LS2WKnhQfYqwgy3H91p85zEDLxigQRtNXBJWBzUby8iw-x7OnK6HOkDLS5RPidFbuWRVUfzzasVSYNiAXXPIIEkVZ4-kPleWEP8B3cqA-IMCryA2Y2YOsMmURqF7dijZ4S0SeCtMmB99PYHQhaY8FSE0_brCKs-09sFMqfP1d3WjtDg8N4U5meXQdkk59A9bGvtIqF4kntraKnv9jJcJHNWJof6vc-2QdDpyDW2kdQoqhEESrQ3k68nbTauCcCupCFMKnoTowUvrStqiXP',
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
                            'value'    : 'AQEDARSoPqoEQUf_AAABXE3RtxYAAAFcT4krFlEA0PfS09W-Xo9FYDNx97JdclCPEwT2vIWD5Q9qU7lwVMoo0JmySk-lRRUIfAUpo7kY_7bzBBWVLt9RC7WngH_nItmcFiXt8qYQ53MzR8tehYf93NXY',
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
                            'value'    : '"b=TB10:g=932:u=95:i=1495954243:t=1495959564:s=AQHKVm45HAO8iPwXNSzBOSF77peBqDDS"',
                            'domain'   : '.linkedin.com',
                            'path'     : '/',
                            'httponly' : false,
                            'secure'   : false,
                            'expires'  : (new Date()).getTime() + (10000 * 6000 * 600)
                        },
                        {
                            'name'     : 'sl',
                            'value'    : '"v=1&W-WFK"',
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
                    page.open('https://www.linkedin.com/jobs/search/?locationId=pk%3A0&sortBy=DD').then(function (status) {
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
                                        $('img').each(function () {
                                            try {
                                                var data = JSON.parse($(this).next().text());
                                                if(data.hasOwnProperty('companyDetails')){
                                                    console.log("extracting ........");
                                                    var job = {};
                                                    job['jobContent'] = data.description.text;
                                                    job['jobDatePosted'] = list.datePosted;
                                                    job['jobLocation'] = list.jobLocation;
                                                    job['jobUrl'] = list.jobLink;
                                                    job['jobTitle'] = list.jobTitle;
                                                    job['jobProvider'] = data.companyDetails["com.linkedin.voyager.jobs.JobPostingCompany"].companyResolutionResult.name;
                                                    job['jobProviderLogo'] = data.companyDetails["com.linkedin.voyager.jobs.JobPostingCompany"].companyResolutionResult.logo.image["com.linkedin.voyager.common.MediaProcessorImage"].id
                                                    job['jobId'] = 'linkedin-'+list.id;
                                                    job['jobSource'] = 'linkedin';
                                                    jobs.push(job);
                                                }
                                            } catch (e) {
                                                console.log("exception thrown");
                                            }

                                        });
                                        console.log("executed");
                                        callback();
                                    });
                                });
                            },function (err) {
                                if(err){
                                    console.log(err);
                                    phInstance.exit()
                                }else{
                                    fs.writeFileSync('liJOBS.json',JSON.stringify(jobs,null,2));
                                    console.log('done!');
                                    console.log('waiting....');
                                    phInstance.exit();
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
        phInstance.exit();
    });
