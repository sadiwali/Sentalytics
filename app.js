var request = require('request');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var credentials = require('./credentials.json'); // api credentials

toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  username: credentials.watson.username,
  password: credentials.watson.password,
  headers: { 'X-Watson-Learning-Opt-Out': 'true' }
});

firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// initialize firebase
firebase.initializeApp(credentials.firebase);
db = firebase.firestore();

all_sentiments = [
  // from general tone
  'anger',
  'disgust',
  'fear',
  'joy',
  'sadness',
  'analytical',
  'confident',
  'tentative',
  // from chat tone
  'sad',
  'frustrated',
  'satisfied',
  'excited',
  'polite',
  'impolite',
  'sympathetic'
];

sentiments_used = [

];


var indexRouter = require('./routes/index');
var analyzeRouter = require('./routes/analyze');
var hbs = require('express-handlebars');
const fs = require('fs');


// global vars

sentiment_avgs = {
  anger: { avg: 0, num: 0 },
  fear: { avg: 0, num: 0 },
  joy: { avg: 0, num: 0 },
  sadness: { avg: 0, num: 0 },
  analytical: { avg: 0, num: 0 },
  confident: { avg: 0, num: 0 },
  tentative: { avg: 0, num: 0 }
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
// route setup
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