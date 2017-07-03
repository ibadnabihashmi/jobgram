var elasticsearch = require('elasticsearch');
var url = require('./urls').elasticSearch;

var client = new elasticsearch.Client( {
    host: url,
    log: 'trace'
});

module.exports = client;