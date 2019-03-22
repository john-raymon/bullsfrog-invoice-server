var express = require('express');
var router = express.Router();

// users router
router.use('/users', require('./users'));

// knack related request
router.use('/knack', require('./knack'))

module.exports = router;
