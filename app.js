var request = require('request');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var credentials = require('./credentials.json'); // api credentials
var Twitter = require('twitter');
var firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
firebase.initializeApp(credentials.firebase);


// global apis
// the twitter api
twitterClient = new Twitter(credentials.twitter); 
// the ibm watson tone analyzer api
toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  username: credentials.watson_tone_analyzer.username,
  password: credentials.watson_tone_analyzer.password,
  headers: { 'X-Watson-Learning-Opt-Out': 'true' }
});
// the firebase database
db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

// global apis ends


var all_sentiments = [
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
// using chat tone sentiments as they are more relavant.
sentiments_used = [
  'sad',
  'frustrated',
  'satisfied',
  'excited',
  // 'polite',
  // 'impolite',
  'sympathetic'
];
// colors to use for each sentiment
sentiment_colors = {
  "frustrated": "#FF6383",
  "sympathetic": "#FF9F40",
  "excited": "#FFCD56",
  "sad": "#36A2EB",
  "polite": "#4BC0C0",
  "impolite": "#7ED321",
  "satisfied": "#8163FF",
};

sentiment_sample_comments = {
  'frustrated': ['frustrated 1'],
  'sympathetic': ['sympathetic 1'],
  'excited': ['excited 1'],
  'sad': ['sad 1'],
  'polite': ['polite 1'],
  'impolite': ['impolite 1'],
  'satisfied': ['satisfied 1']
}
// sentiment count
sentiments_count = {}
// populate sentiment count object programmatically
for (var sentiment in sentiments_used) sentiments_count[sentiment] = 0;


// debug purposes, this list is used while twitter scrubber is being developed

twitter_data = [
  {
    id: 0,
    user: "Andrea",
    message: "Trying to pay CRA source deductions. Link on CRA page to pay from BMO account through interact online hasn't worked for days. Any idea of issue is BMO or CRA?"
  },
  {
    id: 1,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 2,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 3,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 4,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 5,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 6,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 7,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 8,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 9,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 10,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 11,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 12,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 13,
    user: "Bob",
    message: "I really this product."
  },
  {
    id: 14,
    user: "Bob",
    message: "I really this product."
  },
];











var indexRouter = require('./routes/index');
var analyzeRouter = require('./routes/analyze');
var hbs = require('express-handlebars');
const fs = require('fs');




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


// azad's stuff


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Sentalytics has started!");
});