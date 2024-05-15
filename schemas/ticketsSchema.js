const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema({
  busid: mongoose.Schema.ObjectId,
  economySeats: Number,
  businessSeats: Number,
  economyPrice: Number,
  businessPrice: Number,
});

module.exports = mongoose.model("tickets", ticketsSchema);
