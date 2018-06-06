var express = require('express');
var router = express.Router();
// on load, option to analyze

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('dashboard', { title: 'Sentalytics' });
});

module.exports = router;
