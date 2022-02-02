var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tutorsRouter = require('./routes/tutors');
var supervisorsRouter = require('./routes/supervisors');
var studentsRouter = require('./routes/students');
var orgsRouter = require('./routes/orgs');
var locationsRouter = require('./routes/locations');
var availableTimesRouter = require('./routes/availableTimes');
var appointmentsRouter = require('./routes/appointments');
var subjectsRouter = require('./routes/subjects');
var tutorSubjectsRouter = require('./routes/tutorSubjects');
var requestsRouter = require('./routes/requests');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tutors', tutorsRouter);
app.use('/supervisors', supervisorsRouter);
app.use('/students', studentsRouter);
app.use('/orgs', orgsRouter);
app.use('/locations', locationsRouter);
app.use('/availableTimes', availableTimesRouter);
app.use('/appointments', appointmentsRouter);
app.use('/subjects', subjectsRouter);
app.use('/requestsSubjects', requestsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
