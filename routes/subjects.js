var express = require('express');
const { authenticate, isTutor } = require('../controllers/auth');
var router = express.Router();

function validate(course) {
  var errorMessage = "[";
  if (course.orgName == null || course.orgName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"orgName" , "message":"Must have name"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/', [authenticate], function(req, res, next) {
	res.locals.connection.query("SELECT * FROM subjects", function(error, results, fields) {
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
  });

router.get('/:tutorID', [authenticate], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM subjects s natural join tutorsubjects t where t.tutorID = ?", req.params.tutorID, function(error, results, fields) {
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
});

router.put('/:subjectID', [authenticate, isTutor], function(req, res, next) {
	var errorMessage = validate(req.body);
	if (errorMessage.length > 2) {
	  res.status(406);
	  res.send(errorMessage);
	}
	else {
	  res.locals.connection.query("UPDATE tutorsubjects SET ? WHERE subjectID = ? AND tutorID = ?", [req.body, req.params.subjectID, req.user.id], function(error, results, fields) {
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

router.post('/', [authenticate, isTutor], function(req, res, next) {
	var errorMessage = validate(req.body);
	if (errorMessage.length > 2) {
	  res.status(406);
	  res.send(errorMessage);
	}
	else {
		res.locals.connection.query("INSERT INTO tutorsubjects SET ?", req.body, function(error, results, fields) {
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
	}
  });
  
  router.delete('/:subjectID', [authenticate, isTutor], function(req, res, next) {
	res.locals.connection.query("DELETE FROM tutorsubjects WHERE tutorID = ? and subjectID = ?", [req.user.id, req.params.subjectID], function(error, results, fields) {
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
  });

  module.exports = router;