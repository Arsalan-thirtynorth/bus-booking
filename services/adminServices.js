const mongoose = require("mongoose");

const bus = require("../schemas/bussesSchema");
const booking = require("../schemas/bookingSchema");

const addbus = async (req, resp) => {
  try {
    const busNumber = req.body.busNumber;
    const findBus = await bus.findOne({ busNumber });
    if (!findBus) {
      const newbus = new bus({
        busNumber: req.body.busNumber,
        stops: req.body.stops,
        departureTime: req.body.departureTime,
        economySeatsAvailable: req.body.economySeatsAvailable,
        businessSeatsAvailable: req.body.businessSeatsAvailable,
        economyPrice: req.body.economyPrice,
        businessPrice: req.body.businessPrice,
      });
      const saveBus = await newbus.save();
      resp.json(newbus);
    } else {
      resp.json({
        message: "bus already exists",
      });
    }
  } catch (err) {
    resp.json(err);
  }
};

const updateBus = async (req, resp) => {
  try {
    const findBus = await bus.findOne({ _id: req.params.busId });
    console.log(findBus);
    if (findBus) {
      const updatebus = await bus.updateOne({
        economyPrice: req.body.economyPrice,
        businessPrice: req.body.businessPrice,
      });
      resp.json({ updatebus });
    } else {
      resp.json({
        message: "bus not found",
      });
    }
  } catch (err) {
    resp.json(err);
  }
};

const getBookings = async (req, resp) => {
  try {
    const findBookings = await booking.find();
    resp.json(findBookings);
  } catch (err) {
    resp.json(err);
  }
};

const delBooking = async (req, resp) => {
  try {
    const findBooking = await booking.findOne({ _id: req.params.bookingId });
    if (findBooking) {
      const deleteBooking = await booking.deleteOne({
        _id: req.params.bookingId,
      });
      resp.json({ deleteBooking });
    } else {
      resp.json({
        message: "booking not found",
      });
    }
  } catch (err) {
    resp.json(err);
  }
};

module.exports = { addbus, updateBus, getBookings, delBooking };
