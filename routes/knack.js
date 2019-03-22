var express = require('express');
var { ViewBasedClient }  = require('knackhq-client');
var router = express.Router();
var auth = require('./auth')

/* GET users listing. */
router.get('/invoices-to-do', auth.required, function(req, res, next) {
  const client = new ViewBasedClient({app_id: process.env.APP_ID, token: req.knackAuth.token});
  client.getAllRecords('445', '839').then((data) => {
    if (!data.error) {
      return res.json(data.response.body)
    }
    return res.status(res.statusCode).json({ error:  data.error })
  }).catch(next)
});


module.exports = router;
