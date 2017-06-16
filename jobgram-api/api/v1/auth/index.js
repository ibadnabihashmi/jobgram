var async       = require('async');
var crypto      = require('crypto');
var User        = require('../../../models/User');
var express     = require('express');
var router      = express.Router();
var nodemailer  = require('nodemailer');
var passport    = require('passport');
var moment      = require('moment');
var jwt         = require('jsonwebtoken');

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.SESSION_SECRET);
}

router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (!user) {
      return res.status(404).send({
        status:404,
        message:"user not found"
      });
    }
    return res.status(201).send({
      token: generateToken(user),
      user:user,
      status:201,
      exception:null,
      message:'User logged in'
    });
  })(req, res, next);
});

router.post('/signup',function(req, res, next){
  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      return res.status(400).send({
        status:400,
        exception:'Bad Request',
        message:'Not allowed , the user already exist'
      });
    }else{
      user = new User({
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        password: req.body.password
      });
      user.save(function(err) {
        if(err){
          return res.status(500).send({
            status:500,
            exception:'Internal server error',
            message:'Internal server error'
          });
        }
        return res.status(201).send({
          token: generateToken(user),
          user:user,
          status:201,
          exception:null,
          message:'New user created'
        });
      });
    }
  });
});

router.get('/logout',function(req,res){
  req.logout();
  return res.status(200).send({
    status:200,
    exception:null,
    message:'logged out successfully'
  });
});

module.exports = router;
