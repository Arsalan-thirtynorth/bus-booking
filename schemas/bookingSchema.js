const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  busid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  stop: {
    type: String,
    required: true,
  },
  breaks: {
    type: [{ type: String }],
  },
  ticketCategory: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: [{ type: Number }],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  // paymentMethod: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("bookings", bookingsSchema);
