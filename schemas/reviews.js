const mongoose = require("mongoose");
const { type } = require("os");

const reviewsSchema = new mongoose.Schema({
  userid: mongoose.Schema.ObjectId,
  busid: mongoose.Schema.ObjectId,
  reviews: [{ type: String }],
});

module.exports = mongoose.model("reviews", reviewsSchema);
