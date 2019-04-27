var mongoose = require("mongoose")
var findOrCreate = require("mongoose-find-or-create")

const SettingSchema = new mongoose.Schema({
  id: { type: String },
  companyName: { type: String, default: "" },
  companyPhoneNumber: { type: String, default: "" },
  companyEmail: { type: String, default: "" },
  companyAddress: { type: String, default: "" },
  companyCityState: { type: String, default: "" },
  companyZip: { type: String, default: "" },
  companyOpeningStatement: { type: String, default: "" }
}, { id: false })

SettingSchema.plugin(findOrCreate)

const Setting = mongoose.model("Setting", SettingSchema)

module.exports = Setting
