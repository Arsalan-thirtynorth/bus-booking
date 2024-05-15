const express = require("express");
const {
  register,
  login,
  userDetails,
  updateUserDetails,
} = require("../services/userServices");

const { specificUserbooking } = require("../services/bookingServices");

const router = express.Router();
router.use(express.json());

router.post("", register);
router.post("/login", login);
router.get("/:id", userDetails);
router.put("/:id", updateUserDetails);
router.get("/:userId/bookings", specificUserbooking);

module.exports = router;
