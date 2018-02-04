var express           = require('express');
var path              = require('path');
var logger            = require('morgan');
var compression       = require('compression');
var methodOverride    = require('method-override');
var session           = require('express-session');
var bodyParser        = require('body-parser');
var expressValidator  = require('express-validator');
var dotenv            = require('dotenv');
var mongoose          = require('mongoose');
var passport          = require('passport');
var cors              = require('cors');

var api               = require('./api/v1');

var APIUSER           = require('./models/ApiUser');

// Load environment variables from .env file
dotenv.load();
require('./config/passport');

var app = express();
// //
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', process.env.PORT || 3001);
app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/api/v1',function (req,res,next) {
  APIUSER
    .findOne({
      '$and':[
        {'key':req.headers.key},
        {'user':req.host}
      ]
    })
    .exec(function (err,apiuser) {
      if(err || !apiuser){
        res.status(403).send({
          err:'not authorized'
        });
      }else{
        next();
      }
    });
},api);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
