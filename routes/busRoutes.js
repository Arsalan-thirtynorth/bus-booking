const express = require("express");
const {
  getBuses,
  specificBus,
  specificBusSeats,
  busSchedule,
} = require("../services/bussesServices");
const router = express.Router();
router.use(express.json());

router.get("", getBuses);
router.get("/:id", specificBus);
router.get("/:id/seats/", specificBusSeats);
router.get("/:id/schedule", busSchedule);
module.exports = router;
