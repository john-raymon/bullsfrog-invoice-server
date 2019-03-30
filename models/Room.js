var mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
  roomName: { type: String , required: [ true, 'is required'] },
  lineItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "LineItem"}],
  length: String,
  width: String,
  height: String,
  typeOfCieling: String,
})

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room
