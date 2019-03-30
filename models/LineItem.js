var mongoose = require("mongoose")

const LineItemSchema = new mongoose.Schema({
  description: { type: String , required: [ true, 'is required'] },
  quantity: Number,
  unitOM: String,
  unitPrice: Number,
  total: Number
})

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room
