var express = require('express');
var router = express.Router();
var db = firebase.firestore();
// on load, option to analyze

var visited = false;

/* GET home page. */
router.get('/', function (req, res, next) {

  if (!visited) {
    setInterval(() => {
      console.log("visited");
    }, 1000);
    visited = true;
  } else {
    console.log("visited already!");
  }
  // res.render('index', {
  //   title: 'Sentalytics', anger: sentiment_avgs['anger'],
  //   fear: sentiment_avgs['fear'], joy: sentiment_avgs['joy'], sadness: sentiment_avgs['sadness'],
  //   analytical: sentiment_avgs['analytical'], confident: sentiment_avgs['confident'],
  //   tentative: sentiment_avgs['tentative']
  // });
});

router.post('/setresponse', function (req, res, next) {
  let id = req.body.id;
  let message = req.body.message;

  // customize the responses to send out

  db.collection('responses').doc(id.toString()).set({
    message: message
  }).then(() => {
    res.redirect('/');
  });


});


module.exports = router;
