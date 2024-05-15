const express = require("express");
const {
  newBooking,
  detailSpecificBooking,
  cancelBooking,
  specificUserbooking,
} = require("../services/bookingServices");
const router = express.Router();
router.use(express.json());

router.post("", newBooking);
router.get("/:id", detailSpecificBooking);
router.delete("/:id", cancelBooking);
router.get("/user/:userId", specificUserbooking);

module.exports = router;
