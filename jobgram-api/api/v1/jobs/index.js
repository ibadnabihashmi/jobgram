var express     = require('express');
var router      = express.Router();
var Jobs        = require('../../../models/Jobs');
var exec        = require('child_process').fork;
var fs          = require('fs');

router.get('/getAllJobs',function (req,res) {
  Jobs.find().exec(function (err,jobs) {
    if(err){
      res.status(500).send({
        status:500,
        message:err
      });
    }else{
      res.status(200).send({
        status:200,
        jobs:jobs
      });
    }
  })
});

router.get('/run/:file',function (req,res) {
  var cmd = process.env.LIB_PATH+req.params.file;
  console.log(cmd);
  exec(cmd);
  res.status(200).send({
    status:200,
    message:'some message'
  });
});
//
// router.get('/runAll',function () {
//   fs.
// });

module.exports = router;
