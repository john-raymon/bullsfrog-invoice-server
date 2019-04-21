const express = require('express');
const router = express.Router();
const auth = require('./auth')
const parser = require('./../config/multer-cloudinary')

// Models
const Invoice = require('./../models/Invoice')

// create or update existing invoice
router.post('/:invoiceUUID', parser.array('invoiceImages'), function(req, res, next) {
  const invoiceUUID = req.params.invoiceUUID
  console.log('the invoice is', req.body)
  // check if invoiceUUID exist
  // find or create invoice, then check if it is a draft,
  // if it isn't redirect client to pdf detailed version of invoice
  new Promise((resolve, reject) => {
    Invoice.findOrCreate({ id: invoiceUUID }, function(err, invoice) {
      if (err) reject(err)
      if (invoice.draft !== true) res.status(422).json("This invoice can no longer be edited since it is no longer a draft")
      if (req.files) {
        const newImages = req.files.map((file) => file.url)
        invoice.images = [...invoice.images, ...newImages]
      }
      if (req.body.invoiceName !== undefined || typeof req.body.invoiceName !== 'undefined') {
        invoice.invoiceName = req.body.invoiceName
      }
      if (req.body.customersFullName !== undefined || typeof req.body.customersFullName !== 'undefined') {
        invoice.customer.fullName = req.body.customersFullName
      }
      if (req.body.customersAddress !== undefined || typeof req.body.customersAddress !== 'undefined') {
        invoice.customer.address = req.body.customersAddress
      }
      if (req.body.customersCityState !== undefined || typeof req.body.customersCityState !== 'undefined') {
        invoice.customer.cityState = req.body.customersCityState
      }
      if (req.body.customersZipCode !== undefined || typeof req.body.customersZipCode !== 'undefined') {
        invoice.customer.zipCode = req.body.customersZipCode
      }
      if (req.body.insuranceCarrier !== undefined || typeof req.body.insuranceCarrier !== 'undefined') {
        invoice.claim.insuranceCarrier = req.body.insuranceCarrier
      }
      if (req.body.policyNumber !== undefined || typeof req.body.policyNumber !== 'undefined') {
        invoice.claim.policyNumber = req.body.policyNumber
      }
      if (req.body.claimNumber !== undefined || typeof req.body.claimNumber !== 'undefined') {
        invoice.claim.claimNumber = req.body.claimNumber
      }
      if (req.body.dateOfLoss !== undefined || typeof req.body.dateOfLoss !== 'undefined') {
        invoice.claim.dateOfLoss = req.body.dateOfLoss
      }
      if (req.body.rooms !== undefined || typeof req.body.rooms !== 'undefined') {
        const rooms = req.body.rooms
        const roomUUIDs = Object.keys(rooms)
        if (roomUUIDs.length > 0) {
          req.body.rooms = rooms
        }
      }
      if (req.body.totalCost !== undefined || typeof req.body.totalCost !== 'undefined') {
        invoice.totalCost = req.body.totalCost
      }
      if (req.body.totalLaborCost !== undefined || typeof req.body.totalLaborCost !== 'undefined') {
        invoice.totalLaborCost = req.body.totalLaborCost
      }
      if (req.body.totalMaterialCost !== undefined || typeof req.body.totalMaterialCost !== 'undefined') {
        invoice.totalMaterialCost = req.body.totalMaterialCost
      }
      resolve(invoice)
    })
  }).then((invoice) => {
    return invoice.save().then((invoice) => {
      return res.json(invoice)
    })
  }).catch(next)

})

module.exports = router
