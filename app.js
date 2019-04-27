require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const mongoose = require("mongoose")

var app = express();

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/bullfrog_invoices", { useNewUrlParser: true });
  mongoose.set("debug", true);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// require models
require("./models/Invoice")

app.use(require('./routes'));

if (isProduction) {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// forward 404s to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (isProduction) {
    console.log(err.stack); // print stacktrace
  }
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message || "",
      error: err
    }
  });
});

module.exports = app;
