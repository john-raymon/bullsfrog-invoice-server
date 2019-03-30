var mongoose = require("mongoose")

const InvoiceSchema = new mongoose.Schema({
  estimateName: { type: String , required: [ true, 'is required'] },
  images: [String],
  draft: { type: Boolean, default: true },
  invoiceTitle: String,
  customer: {
    customerKnackId: String,
    address: String,
    city: String,
    state: String,
    zipcode: String
  },
  salesTaxPercentageUsed: { type: Number, default: "0" },
  claim: {
    insuranceCarrier: String,
    policyNumber: String,
    claimNumber: String, // adjusters name replacement,
    dateOfLoss: String,
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
  totalCost: Number
})

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = Invoice
