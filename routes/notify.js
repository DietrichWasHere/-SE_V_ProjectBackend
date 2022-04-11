var express = require('express');
var router = express.Router();

const accountSid = 'ACff432622f6929' + 'aaa5d3d5c44779e700b';
const authToken = '050cbb8cacc6ee58f' + '770112bea81a720';
const client = require('twilio')(accountSid, authToken);

router.post('/', function(req, res, next) {
	client.messages
	.create({
		body: req.body.msg,
		from: '+12766248971',
		to: req.body.to
	})
	.then(message => {console.log(message); res.status(200)});
});

module.exports = router;