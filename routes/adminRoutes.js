const express = require("express");
const {
  addbus,
  updateBus,
  getBookings,
  delBooking,
} = require("../services/adminServices");
const router = express.Router();
router.use(express.json());

router.post("/buses", addbus);
router.put("/buses/:busId", updateBus);
router.get("/bookings", getBookings);
router.delete("/bookings/:bookingId", delBooking);

module.exports = router;
