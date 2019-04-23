const mongoose = require("mongoose")
const findOrCreate = require("mongoose-find-or-create")

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, index: true },
  invoiceName: { type: String, default: '' },
  images: {
    type: Map,
    of: {
      url: String,
      public_id: { type: String, index: true }
    },
    default: new Map()
  },
  draft: { type: Boolean, default: true },
  customer: {
    customerKnackId: { type: String, default: '' },
    fullName: { type: String, default: '' },
    address: { type: String, default: '' },
    cityState: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  salesTaxPercentageUsed: { type: Number, default: "0" },
  claim: {
    insuranceCarrier: { type: String, default: '' },
    policyNumber: { type: String, default: '' },
    claimNumber: { type: String, default: '' }, // adjusters name replacement,
    dateOfLoss: { type: String, default: '' },
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
  totalCost: { type: String, default: '0.00' },
  totalLaborCost: { type: String, default: '0.00' },
  totalMaterialCost: { type: String, default: '0.00' }
}, { id: false})

InvoiceSchema.plugin(findOrCreate)

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = Invoice
