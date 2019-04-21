var express = require('express');
var router = express.Router();

// users router
router.use('/users', require('./users'));

// knack related request
router.use('/knack', require('./knack'))

// save invoices
router.use('/invoices', require('./invoices'))


// error handler; catches UnauthorizedError, otherwise calls next errorhandler in stack
router.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: { Authentication: "You must be authenticated as a host" }
    });
  }
  next(err);
});

module.exports = router;
