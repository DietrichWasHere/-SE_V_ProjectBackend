var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var dbconfig = require("./config/db.config");
var cors = require("cors");

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var usersRouter = require('./routes/users');
var tutorsRouter = require('./routes/tutors');
var studentsRouter = require('./routes/students');
var supervisorsRouter = require('./routes/supervisors');
var orgsRouter = require('./routes/orgs');
var appointmentsRouter = require('./routes/appointments');
var apptrequestsRouter = require('./routes/apptrequests');
var subjectsRouter = require('./routes/subjects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Database connection
app.use(function(req, res, next) {
  res.locals.connection = mysql.createConnection(dbconfig);
  res.locals.connection.connect();
  next();
});

const corsOptions = {
  origin: '*',
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS']
}
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/tutors', tutorsRouter);
app.use('/students', studentsRouter);
app.use('/supervisors', supervisorsRouter);
app.use('/orgs', orgsRouter);
app.use('/appointments/requests', apptrequestsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/subjects', subjectsRouter);

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

var port = '8081';
var hostname = 'localhost';
app.listen(port, hostname, function () {
  console.log("The server is running at http://".concat(hostname, ":").concat(port));
});

module.exports = app;
