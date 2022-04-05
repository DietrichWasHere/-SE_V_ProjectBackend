var express = require('express');
const { authenticate, isTutor } = require('../controllers/auth');
var router = express.Router();

router.get('/', [authenticate, isTutor], function(req, res, next) {
	res.locals.connection.query("SELECT r.*, a.startDateTime, a.endDateTime FROM apptrequests r, appointments a WHERE a.appointmentID = r.appointmentID and a.tutorID = ?", req.user.id, function(error, results, fields) {
	  if (error) {
		res.status(500);
		res.send(JSON.stringify({ status: 500, error: error, response: null }));
	  } else {
		res.status(200);
		res.send(JSON.stringify(results));
	  }
	  res.locals.connection.end();
	});
  });
  
  router.post('/', [authenticate], function(req, res, next) {
		  res.locals.connection.query("INSERT INTO apptrequests SET ?", [req.body], function(error, results, fields) {
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
  
  router.put('/:studentID/:appointmentID', [authenticate], function(req, res, next) {
		  res.locals.connection.query("UPDATE apptrequests SET ? WHERE studentID = ? and appointmentID = ?", [req.body, req.params.studentID, req.params.appointmentID], function(error, results, fields) {
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
  
module.exports = router;