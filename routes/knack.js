var express = require('express');
var { ViewBasedClient } = require('knackhq-client');
var router = express.Router();
var auth = require('./auth')

/* GET invoices to do from Knack */
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

/* Find a CUSTOMER using ID */
router.get('/search-customers/:customer', auth.required, function(req, res, next) {
  const client = new ViewBasedClient({
    app_id: process.env.APP_ID,
    token: req.knackAuth.token,
  })
  const options = {
    url: `pages/scene_${'20'}/views/view_${'120'}/records/${req.params.customer}`,
    method: 'GET'
  }

  client.request(options).then((ress) => {

    if (ress.statusCode === 200) {
      return res.json({ response: ress })

    } else if (ress.statusCode === 401) {
      return res.status(ress.statusCode).json({ error: Error('You are not authenticated'), response: ress })

    } else if (ress.statusCode === 403 ) {
      return res.status(ress.statusCode).json({ error: Error('You do not have proper access to this resource'), response: ress })

    }
    return res.status(500).json({ error: Error('There seems to be an problem trying to connect to Knack\'s server'), response: ress })
  }).catch(next)
})

/* Search CUSTOMERS */
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
