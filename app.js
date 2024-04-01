var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var menuRouter = require('./routes/menu');
var reservationRouter = require('./routes/reservation');
const swaggerui = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const swaggerDocument = require('./bin/swagger-output.json');

// const doc = {
//   info: {
//     title: 'toDoList API',
//     description: 'This is my first project. Don\'t judge too harshly'
//   },
//   host: 'localhost:8080',
//   schemes: ['http']
// };
// const outputFile = './bin/swagger-output.json';
// const routes = ['./app.js'];

// swaggerAutogen(outputFile, routes, doc);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menu', menuRouter);
app.use('/reservation', reservationRouter);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument))

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
