const mongoose = require("mongoose");

const bus = require("../schemas/bussesSchema");
const { response } = require("express");

const getBuses = async (req, res) => {
  try {
    const buses = await bus.find();
    res.json(buses);
  } catch {
    res.json(err);
  }
};

const specificBus = async (req, res) => {
  try {
    if (req.params.id) {
      const bus_id = req.params.id;
      console.log(bus_id);
      const specificBus = await bus.findOne({ _id: bus_id });
      res.json(specificBus);
    } else {
      res.status(400).json({
        message: "Please provide a bus id",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const specificBusSeats = async (req, res) => {
  try {
    if (req.params.id) {
      const bus_id = req.params.id;
      const specificBus = await bus.findOne({ _id: bus_id });
      res.json({
        economyseats: specificBus.economySeatsAvailable,
        businessseats: specificBus.businessSeatsAvailable,
      });
    } else {
      res.status(400).json({
        message: "Please provide a bus id",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const busSchedule = async (req, res) => {
  try {
    if (req.params.id) {
      const bus_id = req.params.id;
      const specificBus = await bus.findOne({ _id: bus_id });
      if (specificBus) {
        res.json({
          departure: specificBus.departure,
          departureTime: specificBus.departureTime,
        });
      } else {
        res.send("wronge id");
      }
    } else {
      res.status(400).json({
        message: "Please provide a bus id",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
  getBuses,
  specificBus,
  specificBusSeats,
  busSchedule,
};
