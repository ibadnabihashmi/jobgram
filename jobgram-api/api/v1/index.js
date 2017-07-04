var express = require('express');
var router = express.Router();
var user = require('./user/index');
var auth = require('./auth/index');
var feed = require('./feed/index');
var jobs = require('./jobs/index');

router.use('/user',user);
router.use('/auth',auth);
router.use('/feed',feed);
router.use('/jobs',jobs);

module.exports = router;
