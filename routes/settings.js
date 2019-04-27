var express = require("express")
var router = express.Router()
var auth = require("./auth")

// Models
var findOrCreateSettings = require("./../services/findOrCreateSettingsDocument")

const checkIfUndefined = (property) => {
  return (property !== undefined || typeof property !== 'undefined')
}

router.get("/", auth.required, function(req, res, next) {
  findOrCreateSettings()
  .then((settings) => {
    return res.json({ settings })
  })
  .catch(next)
})

router.post("/update", auth.required, function(req, res, next) {
  const { companyName, companyEmail, companyAddress, companyCityState, companyPhoneNumber, companyZip, companyOpeningStatement } = req.body
  findOrCreateSettings()
  .then((settings) => {
    if (checkIfUndefined(companyName)) {
      settings.companyName = companyName
    }
    if (checkIfUndefined(companyPhoneNumber)) {
      settings.companyPhoneNumber = companyPhoneNumber
    }
    if (checkIfUndefined(companyEmail)) {
      settings.companyEmail = companyEmail
    }
    if (checkIfUndefined(companyAddress)) {
      settings.companyAddress = companyAddress
    }
    if (checkIfUndefined(companyCityState)) {
      settings.companyCityState = companyCityState
    }
    if (checkIfUndefined(companyZip)) {
      settings.companyZip = companyZip
    }
    if (checkIfUndefined(companyOpeningStatement)) {
      settings.companyOpeningStatement = companyOpeningStatement
    }
    return settings.save()
  })
  .then((settings) => res.json({ settings : settings }))
  .catch(next)
})

module.exports = router
