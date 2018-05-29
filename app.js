var request = require('request');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
credentials = require('credentials.json');
firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// initialize firebase
firebase.initializeApp(credentials.firebase);

var indexRouter = require('./routes/index');
var analyzeRouter = require('./routes/analyze');
var hbs = require('express-handlebars');
const fs = require('fs');




// global vars


sentiment_avgs = {
  anger: 0,
  fear: 0,
  joy: 0,
  sadness: 0,
  analytical: 0,
  confident: 0,
  tentative: 0
}



var app = express();

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/', indexRouter);
app.use('/analyze', analyzeRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


module.exports = app;


/// AZADS STUFF
