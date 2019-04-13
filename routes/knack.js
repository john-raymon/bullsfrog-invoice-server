var express = require('express');
var { ViewBasedClient } = require('knackhq-client');
var router = express.Router();
var auth = require('./auth')

/* GET users listing. */
router.get('/invoices-to-do', auth.required, function(req, res, next) {
  console.log('the query is', req.query, req.query.page, req.query.rows_per_page, req.query.sort_field, req.query.sort_order)
  const client = new ViewBasedClient({app_id: process.env.APP_ID, token: req.knackAuth.token});
  client.getAllRecords('445', '839', req.query.filters, req.query.page, req.query.rows_per_page, req.query.sort_field, req.query.sort_order).then((data) => {
    if (!data.error) {
      return res.json(data.response.body)
    }
    return res.status(res.statusCode).json({ error:  data.error })
  }).catch(next)
});

/* Search USERS */
router.get('/search-customers', auth.required, function(req, res, next) {
  let searchFor = req.query.searchFor || ''
  const client = new ViewBasedClient({
    app_id: process.env.APP_ID,
    token: req.knackAuth.token,
  })
  const filters = {
    "match": "or",
    "rules": [
      {
        "field": "field_15",
        "operator": "contains",
        "value": searchFor
      }
    ]
  }
  client.getAllRecords('20', '120', filters, null, null, null, null).then((data) => {
    console.log('the response in search-customers is', data)
    if (!data.error) {
      return res.json(data.response.body)
    }
    return res.status(res.statusCode).json({ error:  data.error })
  }).catch(next)
})


module.exports = router;
