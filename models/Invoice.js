const mongoose = require("mongoose")
const findOrCreate = require("mongoose-find-or-create")

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, index: true },
  invoiceName: { type: String },
  images: [String],
  draft: { type: Boolean, default: true },
  customer: {
    customerKnackId: String,
    fullName: String,
    address: String,
    cityState: String,
    zipCode: String
  },
  salesTaxPercentageUsed: { type: Number, default: "0" },
  claim: {
    insuranceCarrier: String,
    policyNumber: String,
    claimNumber: String, // adjusters name replacement,
    dateOfLoss: String,
  },
  rooms: {
    type: Map,
    of: {
      roomName: String,
      lineItems: {
        type: Map,
        of: {
          description: String,
          laborCost: String,
          materialCost: String,
          quantity: String,
          total: String,
          totalLabor: String,
          totalMaterial: String,
          uom: String
        }
      },
      roomTotals: {
        totalCost: String,
        totalLabor: String,
        totalMaterial: String
      },
      length: String,
      width: String,
      height: String,
    }
  },
  totalCost: String,
  totalLaborCost: String,
  totalMaterialCost: String
}, { id: false})

InvoiceSchema.plugin(findOrCreate)

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = Invoice
