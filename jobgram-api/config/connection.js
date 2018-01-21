var elasticsearch = require('elasticsearch');

// var client = new elasticsearch.Client( {
//   host: 'https://e0r0qbfw0r:rviz1rnrrt@first-cluster-6366936209.us-east-1.bonsaisearch.net'
// });

var client = new elasticsearch.Client( {
  host: 'localhost:9200'
});

module.exports = client;
