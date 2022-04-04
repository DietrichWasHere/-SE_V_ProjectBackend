var express = require('express');
const { authenticate, isAdmin, isSameUser, isNewUser, isTutorWithOrg, isTutor } = require('../controllers/auth');
var router = express.Router();

function validate(course) {
	var errorMessage = "[";
	if (course.startDateTime == null || course.startDateTime.length == 0) {
	  if (errorMessage.length > 1) errorMessage += ",";
	  errorMessage +=
		'{"attributeName":"startDateTime", "message":"Must have start time"}';
	}
	if (course.endDateTime == null || course.endDateTime.length == 0) {
	  if (errorMessage.length > 1) errorMessage += ",";
	  errorMessage +=
		'{"attributeName":"endDateTime", "message":"Must have end time"}';
	}
	errorMessage += "]";
	return errorMessage;
  }

/*router.get('/:orgID', [authenticate, isTutorWithOrg], function(req, res, next) {
  res.locals.connection.query("SELECT a.*, t.fName as tutorFName, t.lName as tutorLName, s.fName as studentFName, s.lName as studentLName, l.locationName FROM appointments a inner join users t on a.tutorID = t.userID left join locations l on a.locationID = l.locationID left join users s on a.studentID = s.userID where a.tutorID = ? and a.orgID = ?", [req.user.id, req.params.orgID], function(error, results, fields) {
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
});*/

router.get('/:orgID', [authenticate], function(req, res, next) {
	res.locals.connection.query("SELECT a.*, t.fName as tutorFName, t.lName as tutorLName, s.fName as studentFName, s.lName as studentLName, l.locationName FROM appointments a inner join users t on a.tutorID = t.userID left join locations l on a.locationID = l.locationID left join users s on a.studentID = s.userID where a.orgID = ?", [req.params.orgID], function(error, results, fields) {
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

router.post('/', [authenticate, isTutorWithOrg], function(req, res, next) {
	var errorMessage = validate(req.body);
	if (errorMessage.length > 2) {
	  res.status(406);
	  res.send(errorMessage);
	}
	else {
		res.locals.connection.query("INSERT INTO appointments SET ?", req.body, function(error, results, fields) {
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

router.get('/:orgID/:appointmentID', [authenticate], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM appointments WHERE appointmentID = ?", req.params.appointmentID, function(error, results, fields) {
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

router.put('/:appointmentID', [authenticate], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE appointments SET ? WHERE appointmentID = ?", [req.body, req.params.appointmentID], function(error, results, fields) {
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

/*router.delete('/:orgID/:userID', [authenticate, isAdminOrSupervisorWithOrg], function(req, res, next) {
  res.locals.connection.query("DELETE FROM tutors WHERE userID = ? AND orgID = ?", [req.params.userID, req.params.orgID], function(error, results, fields) {
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
});*/

module.exports = router;
