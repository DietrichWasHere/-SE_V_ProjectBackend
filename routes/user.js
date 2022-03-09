var express = require('express');
const { authenticate } = require('../controllers/auth');
var router = express.Router();

router.get('/', [authenticate], function(req, res, next) {
	res.send({user: req.user});
})

module.exports = router;