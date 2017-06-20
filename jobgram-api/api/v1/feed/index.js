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
      query: {
        match_all: {}
      },
      sort: {
        jobDatePosted: {
          order: "asc"
        }
      },
      from:req.query.from,
      size:10
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
