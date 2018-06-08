var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
// on load, option to analyze

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', function (req, res, next) {
  // for each used emotion
  // let querySnapshot = await db.collection("sample_comments").get();
    // let docs = await querySnapshot.docs.map(doc => [doc.id, doc.data()]);

  var sentiment_blocks = [];
  for (var sentiment in sentiments_used) {
    var col = sentiment_colors[sentiments_used[sentiment]];
    sentiment_blocks.push({
      "sentiment": sentiments_used[sentiment],
      "col": col,
      "sample_comments": sentiment_sample_comments[sentiments_used[sentiment]]
  });
  }

  res.render('dashboard', { title: 'Sentalytics', sentiment_blocks: sentiment_blocks });
});

var client = new Twitter({
  consumer_key: '6YyI5jBMQE47qtmAVXe4rh9yP',
  consumer_secret: 'S9jRXPpCYQ3kjOQKaK8t3bg9K0WDEdUk1dRDuwL92XHar5UtNt',
  access_token_key: '110404132-ptRGGeRn9B5NIz8w0zx8mSSb6lneINNTfFccpiHy',
  access_token_secret: 'FVpZkznyG5KtlS8qFCrmAdWvD5Vzm2IicEuv3PYo2OlSK'
});

router.get('/test_message_board', (req, res) => {
  // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
  client.get('statuses/user_timeline', { screen_name: 'bmo', count: 20 }, function(error, tweets, response) {
    if (!error) {
      res.status(200).render('messages', { title: 'Express', tweets: tweets });
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;