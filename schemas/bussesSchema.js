const mongoose = require("mongoose");
const busSchema = new mongoose.Schema({
  busNumber: {
    type: Number,
    required: true,
  },
  stops: {
    type: [{ type: String }],
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  economySeatsAvailable: {
    type: [{ type: Number }],
    required: true,
  },
  businessSeatsAvailable: {
    type: [{ type: Number }],
    required: true,
  },
  economyPrice: {
    type: Number,
    required: true,
  },
  businessPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("busses", busSchema);
