var express = require('express');
const { authenticate } = require('../controllers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', [authenticate], function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;