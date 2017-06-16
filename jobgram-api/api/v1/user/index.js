var express     = require('express');
var router      = express.Router();

router.get('/',function (req,res) {
  res.send(200,{
    cool:'cool'
  });
});

router.get('/yolo',function (req,res) {
  res.send(200,{
    cool:'1'
  });
});

module.exports = router;
