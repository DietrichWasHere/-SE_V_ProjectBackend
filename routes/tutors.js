var express = require('express');
var router = express.Router();

/* GET tutors listing. */
router.get('/', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM tutors", function(error, results, fields) {
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


router.get('/:userID/:orgID', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM tutors WHERE userID = ? and  WHERE orgID = ?", req.params.advisorID, function(error, results, fields) {
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

module.exports = router;
