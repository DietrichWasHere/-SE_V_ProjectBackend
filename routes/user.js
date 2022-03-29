var express = require('express');
const { authenticate, isNewUser } = require('../controllers/auth');
var router = express.Router();

router.get('/', [authenticate], function(req, res, next) {
	res.send({user: req.user});
})

router.post('/', [authenticate, isNewUser], function(req, res, next) {
	res.locals.connection.query("INSERT INTO users SET ?", req.user.user_info, function(error, results, fields) {
		if (error) {
			res.status(500);
			res.send(JSON.stringify({ status: 500, error: error, response: null }));
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.status(201);
			res.send(JSON.stringify(results));
			//If there is no error, all is good and response is 200OK.
		}
		res.locals.connection.end();
	});
});

router.put('/', [authenticate], function(req, res, next) {
	var errorMessage = validate(req.body);
	if (errorMessage.length > 2) {
	  res.status(406);
	  res.send(errorMessage);
	}
	else {
	  res.locals.connection.query("UPDATE users SET ? WHERE userID=?", [req.body, requser.id], function(error, results, fields) {
		if (error) {
		  res.status(500);
		  res.send(JSON.stringify({ status: 500, error: error, response: null }));
		  //If there is error, we send the error in the error section with 500 status
		} else {
		  res.status(200);
		  res.send(JSON.stringify(results));
		  //If there is no error, all is good and response is 200OK.
		}
		res.locals.connection.end();
	  });
	}
  });

module.exports = router;