var express = require('express');
var { ViewBasedClient }  = require('knackhq-client');
var router = express.Router();
var auth = require('./auth')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  console.log(`this is the app id ${process.env.APP_ID}`)
  const client = new ViewBasedClient({app_id: process.env.APP_ID});

  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    client.auth(email, password).then(response => {
      res.json(response)
    }).catch(error => {
      res.status(500).json(error);
    })
  } else {
    res.status(422).json('Please provide a username and password')
  }
});


module.exports = router;
