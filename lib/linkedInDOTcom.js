var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var phInstance = null;
phantom.create()
    .then(instance => {
        console.log('created');
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        console.log('Opening page .....');
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
                        'expires'  : (new Date('2017-06-17T19:14:27.661Z'))
                    },
                    {
                        'name'     : 'CP3',
                        'value'    : '1',
                        'domain'   : '.scorecardresearch.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-06-25T17:40:02.156Z'))
                    },
                    {
                        'name'     : 'CP1',
                        'value'    : '1',
                        'domain'   : '.scorecardresearch.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-06-17T19:14:27.661Z'))
                    },
                    {
                        'name'     : 'JSESSIONID',
                        'value'    : '"ajax:0222002623578150531"',
                        'domain'   : '.www.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : true,
                        'expires'  : (new Date('2017-08-26T06:50:10.566Z'))
                    },
                    {
                        'name'     : 'RT',
                        'value'    : 's=1495954211880&r=https%3A%2F%2Fwww.linkedin.com%2F',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-05-28T07:00:11.000Z'))
                    },
                    {
                        'name'     : 'UID',
                        'value'    : '18D11093a2335aafefdae8g1472502970',
                        'domain'   : '.scorecardresearch.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2018-08-19T20:36:10.868Z'))
                    },
                    {
                        'name'     : 'UIDR',
                        'value'    : '1472502970',
                        'domain'   : '.scorecardresearch.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2018-08-19T20:36:10.868Z'))
                    },
                    {
                        'name'     : '__utma',
                        'value'    : '226841088.446100211.1472762252.1475072730.1490031982.2',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2019-03-20T17:46:22.000Z'))
                    },
                    {
                        'name'     : '__utmz',
                        'value'    : '226841088.1490031982.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-09-19T05:46:22.000Z'))
                    },
                    {
                        'name'     : '_ga',
                        'value'    : 'GA1.2.446100211.1472762252',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2019-05-28T06:50:14.000Z'))
                    },
                    {
                        'name'     : '_gat',
                        'value'    : '1',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-05-28T06:59:44.000Z'))
                    },
                    {
                        'name'     : '_lipt',
                        'value'    : 'CwEAAAFcTdKyPf47t6CiiMtsme4xfPqj20Xe3Pq9DG-04rPsYg9dHx7ntrD9kC71dLKxeBKVS8bdXuqur6xOG_l3-RiwX8Sw9B4dTxA_nTmn9xsHDhURX-8-3xLRs-EB1v2BAX-E4BgVgq_lk8LS2WKnhQfYqwgy3H91p85zEDLxigQRtNXBJWBzUby8iw-x7OnK6HOkDLS5RPidFbuWRVUfzzasVSYNiAXXPIIEkVZ4-kPleWEP8B3cqA-IMCryA2Y2YOsMmURqF7dijZ4S0SeCtMmB99PYHQhaY8FSE0_brCKs-09sFMqfP1d3WjtDg8N4U5meXQdkk59A9bGvtIqF4kntraKnv9jJcJHNWJof6vc-2QdDpyDW2kdQoqhEESrQ3k68nbTauCcCupCFMKnoTowUvrStqiXP',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-06-27T06:51:14.943Z'))
                    },
                    {
                        'name'     : '_lipt',
                        'value'    : 'CwEAAAFcTdKyPf47t6CiiMtsme4xfPqj20Xe3Pq9DG-04rPsYg9dHx7ntrD9kC71dLKxeBKVS8bdXuqur6xOG_l3-RiwX8Sw9B4dTxA_nTmn9xsHDhURX-8-3xLRs-EB1v2BAX-E4BgVgq_lk8LS2WKnhQfYqwgy3H91p85zEDLxigQRtNXBJWBzUby8iw-x7OnK6HOkDLS5RPidFbuWRVUfzzasVSYNiAXXPIIEkVZ4-kPleWEP8B3cqA-IMCryA2Y2YOsMmURqF7dijZ4S0SeCtMmB99PYHQhaY8FSE0_brCKs-09sFMqfP1d3WjtDg8N4U5meXQdkk59A9bGvtIqF4kntraKnv9jJcJHNWJof6vc-2QdDpyDW2kdQoqhEESrQ3k68nbTauCcCupCFMKnoTowUvrStqiXP',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-06-27T06:51:14.943Z'))
                    },
                    {
                        'name'     : 'bcookie',
                        'value'    : '"v=2&d6f567f2-dc5a-49d3-842c-ba4ea9c87a02"',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2018-08-30T05:50:26.085Z'))
                    },
                    {
                        'name'     : 'bscookie',
                        'value'    : '"v=1&201705130557293709094e-0bda-4a94-86a4-2c8410e2d39bAQGlRAYp3gPMTOKCD4CWT8FIXcotF-eb"',
                        'domain'   : '.www.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2019-05-13T17:35:03.302Z'))
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
                        'expires'  : (new Date('2018-05-28T06:50:10.566Z'))
                    },
                    {
                        'name'     : 'liap',
                        'value'    : true,
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-08-26T06:50:10.566Z'))
                    },
                    {
                        'name'     : 'lidc',
                        'value'    : '"b=TB10:g=932:u=95:i=1495954243:t=1495959564:s=AQHKVm45HAO8iPwXNSzBOSF77peBqDDS"',
                        'domain'   : '.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-05-28T08:19:26.588Z'))
                    },
                    {
                        'name'     : 'sl',
                        'value'    : '"v=1&7OiYz"',
                        'domain'   : '.www.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2017-08-26T06:50:10.566Z'))
                    },
                    {
                        'name'     : 'visit',
                        'value'    : '"v=1&M"',
                        'domain'   : 'www.linkedin.com',
                        'path'     : '/',
                        'httponly' : false,
                        'secure'   : false,
                        'expires'  : (new Date('2018-09-01T20:37:55.018Z'))
                    }
                ]
            ).then(function () {
                page.open('https://www.linkedin.com/jobs/search/?locationId=pk%3A0&sortBy=DD').then(function (status) {
                    page.property('content').then(function (content) {
                        var fs = require('fs');
                        var $ = cheerio.load(content.toString());
                        fs.writeFileSync('yolo.json',JSON.stringify(JSON.parse($('img')['7'].next.children[0].data),null,2));
                        console.log('done!');
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
