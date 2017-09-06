var express     = require('express');
var router      = express.Router();
var Tags        = require('../../../models/Tags');
var fs          = require('fs');

router.get('/',function (req,res) {
  Tags
    .find()
    .limit(req.query.size)
    .skip(req.query.page*10)
    .sort({
      'count': -1
    })
    .exec(function (err,tags) {
      if(err){
        res.status(500).send({
          message:'Internal server error'
        });
      }else if(!tags){
        res.status(404).send({
          message:'No tags found'
        });
      }else{
        res.status(200).send({
          resp:tags
        })
      }
  });
});

module.exports = router;
