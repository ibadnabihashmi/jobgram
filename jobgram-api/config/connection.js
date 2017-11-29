var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {
  host: 'https://e0r0qbfw0r:rviz1rnrrt@first-cluster-6366936209.us-east-1.bonsaisearch.net'
});

module.exports = client;
