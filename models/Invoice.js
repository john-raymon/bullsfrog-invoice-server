var mongoose = require("mongoose")

const InvoiceSchema = new mongoose.Schema({
  estimateName: { type: String , required: [ true, 'is required'] },
  images: [String],
  draft: { type: Boolean, default: true },
})
