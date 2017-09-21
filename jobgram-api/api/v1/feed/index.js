var express     = require('express');
var router      = express.Router();
var client      = require('../../../config/connection.js');

router.get('/',function (req,res) {
  res.status(200).json({
    getFeed: {
      url: '/getFeed',
      method: 'GET'
    }
  })
});

router.get('/getFeed',function (req,res) {
  client.search({
    index: 'jobgram',
    type: 'job',
    body: {
      "query": {
        "match_all":{}
      },
      "sort": {
        "jobDatePosted": {
          "order": "desc"
        }
      },
      "from":req.query.from,
      "size":10
    }
  }).then(function (resp) {
    res.status(200).send({
      resp:resp.hits
    });
  }, function (err) {
    console.trace(err.message);
  });
});

router.post('/getFeed',function (req,res) {

  var query = {
    bool: {
      must: []
    }
  };

  if(req.body.keyword && req.body.keyword !== ''){
    query.bool.must.push({
      "multi_match": {
        "query": req.body.keyword,
        "type": "phrase",
        "fields": [
          "jobTitle",
          "jobContent"
        ]
      }
    });
  }

  if(req.body.location && req.body.location !== ''){
    query.bool.must.push({
      "match": {
        "jobLocation": req.body.location
      }
    });
  }

  if(req.body.source && req.body.source !== ''){
    query.bool.must.push({
      "match": {
        "jobSource": req.body.source
      }
    });
  }

  if(req.body.provider && req.body.provider !== ''){
    query.bool.must.push({
      "match": {
        "jobProvider": req.body.provider
      }
    });
  }

  if(req.body.tags && req.body.tags.length > 0){
    query.bool.must.push({
      "terms": {
        "jobTags": req.body.tags
      }
    })
  }

  var sMin = req.body.salaryMin && req.body.salaryMin !== '' ? Number(req.body.salaryMin) : 0;
  var sMax = req.body.salaryMax && req.body.salaryMax !== '' ? Number(req.body.salaryMax) : 9999999999;

  query.bool.must.push({
    "bool": {
      "should": [
        {
          "range": {
            "jobSalary.min": {
              "gte": sMin,
              "lte": sMax
            }
          }
        },
        {
          "range": {
            "jobSalary.max": {
              "gte": sMin,
              "lte": sMax
            }
          }
        }
      ]
    }
  });

  client.search({
    index: 'jobgram',
    type: 'job',
    body: {
      "query": query,
      "sort": {
        "jobDatePosted": {
          "order": "desc"
        }
      },
      "from":req.query.from,
      "size":10
    }
  }).then(function (resp) {
    res.status(200).send({
      resp:resp.hits
    });
  }, function (err) {
    console.trace(err.message);
  });
});

module.exports = router;
