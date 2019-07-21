var express = require("express");
var router = express.Router();
var auth = require("./auth");

// Models
var LineItem = require("../models/LineItem");

// param middleware
router.param("lineItemId", function(req, res, next, lineItemId) {
  LineItem
    .findById(lineItemId)
    .then(lineItem => {
      req.lineItem = lineItem
      next()
    })
    .catch(next)
})

// Create ("save") new line-items
router.post("/save", auth.required, function(req, res, next) {
  const {
    lineItemDescription,
    lineItemQuantity,
    lineItemUnitOM,
    lineItemMaterialUnitPrice,
    lineItemLaborUnitPrice
  } = req.body;
  if (lineItemDescription === undefined || typeof lineItemDescription === 'undefined') {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELD',
      message: 'You must provide atleast a name/description for the line-item before saving it for re-use.'
    })
  }
  const newLineItem = new LineItem({
    description: lineItemDescription,
    quantity: lineItemQuantity,
    unitOM: lineItemUnitOM,
    materialUnitPrice: lineItemMaterialUnitPrice,
    laborUnitPrice: lineItemLaborUnitPrice
  })
  return newLineItem
    .save()
    .then(async (lineItem) => {
      const allSavedLineItems = await LineItem.find({}).catch(error => {
        console.log("Error when querying for all LineItem documents")
        return false;
      })
      return [lineItem, (allSavedLineItems ? allSavedLineItems.map(lineItem => lineItem.getLineItemObject()) : [])]
    })
    .then(([lineItem, allSavedLineItems]) => {
      res.json({
        success: true,
        allSavedLineItems,
        lineItem: lineItem.getLineItemObject()
      })
    })
    .catch(next)
})

// Read ("query") all line-items
router.get("/", auth.required, async function(req, res, next) {
  const { query } = req.body;
  return LineItem
    .find(query)
    .then(lineItems => {
      return res.json({
        success: true,
        allSavedLineItems: lineItems.map(lineItem => lineItem.getLineItemObject())
      })
    })
    .catch(error => {
      next(error)
    })
})

// Delete a line-item
router.post("/:lineItemId/delete", auth.required, function(req, res, next) {
  if (req.lineItem) {
    return LineItem
      .findOneAndDelete({ _id: req.lineItem.id })
      .then(removedLineItem => {
        console.log('this is the lineitem', removedLineItem)
        return res.json({
          success: true,
          lineItem: req.lineItem.getLineItemObject()
        })
      })
      .catch(next)
  } else {
    next()
  }
})
module.exports = router;
