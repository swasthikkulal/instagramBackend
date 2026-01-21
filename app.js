var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require("cors");

dotenv.config(); // Load .env

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

var app = express();
app.use(cors());

// view engine setup (optional if you have no views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Optional: uploads folder (only for testing locally)
app.use("/uploads", express.static("uploads"));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// Simple ping route for Render health check
app.get('/ping', (req, res) => res.json({ status: 'ok' }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler (send JSON instead of EJS on Render)
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
