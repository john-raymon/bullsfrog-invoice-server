const express = require('express')
const router = express.Router()
const request = require('request')
const cloudinary = require("cloudinary")
const auth = require('./auth')
const parser = require('./../config/multer-cloudinary')

// Models
const Invoice = require('./../models/Invoice')


router.post('/:invoiceUUID/generate-invoice', auth.required, function(req, res, next) {
  const { invoiceUUID } = req.params
  return Invoice.findOne({ id: invoiceUUID }).then((invoice) => {
    invoice.draft = false
    return invoice.save()
  }).then(({ customer, id:invoiceUUID }) => {
    const { customerKnackId } = customer
    if (customerKnackId.trim()) {
      const generatedURL = `http://localhost:3000/invoices/pdf/${invoiceUUID}`
      // save this url on Knack database with a connection to customer with customerKnackId
      request({
        url: "https://api.knack.com/v1/objects/object_78/records",
        method: "POST",
        headers: {
          "X-Knack-REST-API-Key": process.env.KNACK_API_KEY,
          "X-Knack-Application-Id": process.env.APP_ID
        },
        form: {
        	field_574: {
            url : generatedURL
          },
        	field_573: customerKnackId
        },
        json: true
      },
      function(err, response, body) {
        if (err) {
          return res.status(400).json({ error: err });
        }
        return res.json(body);
      });
    } else {
      return res.json({ success: true })
    }
  })
  .catch(next)
})

// Destroy image from existing Invoice document, and also from Cloudinary folder
router.post("/:invoiceUUID/remove-image/:publicId", auth.required, function(req, res, next) {
  const { invoiceUUID, publicId } = req.params
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, {}, (error, result) => {
      if (error) reject(error)
      resolve(result)
    });
  }).then((result) => {
    // remove image from Invoice document
    return Invoice.findOne({ id: invoiceUUID })
  }).then((invoice) => {
    let invoiceObject = {}
    for (let [key, value] of invoice.images) {
      invoiceObject[key] = value;
    }
    invoice.images = {...invoiceObject, [publicId]: undefined }
    return invoice.save()
  }).then((invoice) => res.json(invoice)).catch(next)

})


// create or update existing invoice
router.post('/:invoiceUUID', auth.required, parser.array('invoiceImages'), function(req, res, next) {
  const invoiceUUID = req.params.invoiceUUID
  // check if invoiceUUID exist
  // find or create invoice, then check if it is a draft,
  // if it isn't redirect client to pdf detailed version of invoice
  new Promise((resolve, reject) => {
    Invoice.findOrCreate({ id: invoiceUUID }, function(err, invoice) {
      if (err) reject(err)
      if (invoice.draft !== true) res.status(422).json({ error: "NOT_DRAFT"})
      if (req.files) {
        const allFiles = req.files
        const newImages = allFiles.reduce((newImagesObj, file) => {
          newImagesObj[file.public_id] = {
            url: file.url,
            public_id: file.public_id
          }
          return newImagesObj
        },{})
        let invoiceImagesObject = {};
        for (let [key, value] of invoice.images) {
          invoiceImagesObject[key] = value;
        }
        invoice.images = {...invoiceImagesObject, ...newImages}
      }
      if (req.body.invoiceName !== undefined || typeof req.body.invoiceName !== 'undefined') {
        invoice.invoiceName = req.body.invoiceName
      }
      if (req.body.customerKnackId !== undefined || typeof req.body.customerKnackId !== 'undefined') {
        invoice.customer.customerKnackId = req.body.customerKnackId
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
        const existingRoomsObj = {
        }
        for (let [key, value] of (invoice.rooms || new Map())) {
          existingRoomsObj[key] = value
        }
        console.log('these are the existing keys', existingRoomsObj)
        const allRooms = Object.keys(existingRoomsObj).reduce((roomObj, roomUUID) => {
          roomObj[roomUUID] = rooms[roomUUID]
          return roomObj
        },{})
        console.log('these are the rooms', allRooms)
        invoice.rooms = {...existingRoomsObj, ...allRooms, ...rooms}
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
