var express = require('express');
const { authenticate, isAdmin, isAdminOrSupervisorWithOrg } = require('../controllers/auth');
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

/* GET tutors listing. */
router.get('/', [authenticate, isAdmin], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM orgs", function(error, results, fields) {
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


router.get('/:orgID', [authenticate, isAdminOrSupervisorWithOrg], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM orgs WHERE orgID = ?", req.params.advisorID, function(error, results, fields) {
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

router.put('/:orgID', [authenticate, isAdminOrSupervisorWithOrg], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE orgs SET ? WHERE orgID = ?", [req.body, req.params.advisorID], function(error, results, fields) {
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

router.post('/', [authenticate, isAdmin], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO orgs SET ?", req.body, function(error, results, fields) {
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

router.delete('/:orgID', [authenticate, isAdmin], function(req, res, next) {
  res.locals.connection.query("DELETE FROM orgs WHERE orgID = ?", [req.params.majorID, req.params.courseNo], function(error, results, fields) {
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
