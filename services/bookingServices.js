const mongoose = require("mongoose");
const booking = require("../schemas/bookingSchema");
const bus = require("../schemas/bussesSchema");
const user = require("../schemas/userSchema");

const newBooking = async (req, res) => {
  try {
    const findBus = await bus.findOne({ _id: req.body.busid });
    const startIdx = findBus.stops.indexOf(req.body.start);
    const endIdx = findBus.stops.indexOf(req.body.stop);
    if (findBus && startIdx < endIdx) {
      const set = new Set(findBus.economySeatsAvailable);
      const result = req.body.seatNumber.filter((x) => set.has(x));
      if (req.body.seatNumber.length === result.length) {
        const findBooking = await booking.findOne({
          busid: req.body.busid,
          seatNumber: req.body.seatNumber,
          start: req.body.start,
        });
        if (!findBooking) {
          const findEnd = await booking.findOne({
            busid: req.body.busid,
            seatNumber: req.body.seatNumber,
            stop: req.body.stop,
          });

          if (!findEnd) {
            const startIndex = findBus.stops.indexOf(req.body.start);
            const endIndex = findBus.stops.indexOf(req.body.stop);
            const newArray = findBus.stops.slice(startIndex + 1, endIndex);
            console.log(startIndex, endIndex);
            let a = 0;
            for (let i = 0; i < newArray.length; i++) {
              const betweenCheckStart = await booking.findOne({
                busid: req.body.busid,
                seatNumber: req.body.seatNumber,
                start: newArray[i],
              });
              const betweenCheckStop = await booking.findOne({
                busid: req.body.busid,
                seatNumber: req.body.seatNumber,
                stop: newArray[i],
              });

              if (betweenCheckStart || betweenCheckStop) {
                a++;
              }
            }
            let b = 0;
            for (let j = 0; j <= startIndex; j++) {
              for (let k = endIndex; k <= findBus.stops.length; k++) {
                console.log("ok");
                const startt = findBus.stops[j];
                const stopp = findBus.stops[k];
                const sideCheck = await booking.findOne({
                  busid: req.body.busid,
                  seatNumber: req.body.seatNumber,
                  start: startt,
                  stop: stopp,
                });
                console.log(sideCheck);
                if (sideCheck) {
                  b++;
                }
              }
            }

            let price = 0;
            let lenth = 0;
            if (newArray.length === 0) {
              lenth = 1;
            } else {
              lenth = newArray.length + 1;
            }

            price = lenth * findBus.economyPrice;
            console.log(price);

            if (a === 0 && b === 0) {
              const newBooking = new booking({
                userid: req.body.userid,
                busid: req.body.busid,
                start: req.body.start,
                stop: req.body.stop,
                breaks: newArray,
                ticketCategory: req.body.ticketCategory,
                seatNumber: req.body.seatNumber,
                totalPrice: price,
                paymentMethod: req.body.payment,
              });
              const saveBooking = await newBooking.save();
              {
                const findAllBookings = await booking.find({
                  busid: req.body.busid,
                  seatNumber: req.body.seatNumber,
                });
                console.log(findAllBookings);
                const stopsLength = findBus.stops.length - 1;
                let breaksArray = [];
                for (let i = 0; i < findAllBookings.length; i++) {
                  breaksArray = breaksArray.concat(findAllBookings[i].breaks);
                }
                console.log(breaksArray);
                const count = stopsLength - breaksArray.length;
                if (count === findAllBookings.length) {
                  const set2 = new Set(req.body.seatNumber);
                  const delNum = findBus.economySeatsAvailable.filter(
                    (x) => !set2.has(x)
                  );
                  console.log(delNum);
                  const update = await bus.updateOne(
                    { _id: req.body.busid },
                    { $set: { economySeatsAvailable: delNum } }
                  );
                } else {
                  console.log("not del");
                }
              }
              res.json(newBooking);
            } else {
              res.json({
                message: "not valid",
              });
            }
          } else {
            res.json({
              message: "seat not available for this destination",
            });
          }
        } else {
          res.json({
            message: "seat not available for this departure",
          });
        }
      } else {
        res.json({
          message: "seat not available",
        });
      }
    } else {
      res.json({
        message: "please provide correct info",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const detailSpecificBooking = async (req, res) => {
  try {
    const findBooking = await booking.findOne({ _id: req.params.id });
    if (findBooking) {
      const findBus = await bus.findOne({ _id: findBooking.busid });
      console.log(findBooking.userid);
      const findUser = await user.findOne({ _id: findBooking.userid });

      const detail = {
        user: findUser.username,
        busNumber: findBus.busNumber,
        departure: findBus.departure,
        destination: findBus.destination,
        departureTime: findBus.departureTime,
        ticketCategory: findBooking.ticketCategory,
        seatNumber: findBooking.seatNumber,
        totalPrice: findBooking.totalPrice,
      };

      res.json({ detail });
    } else {
      res.json({
        message: "Booking not found",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const findBooking = await booking.findOne({ _id: req.params.id });
    if (findBooking) {
      if (findBooking.ticketCategory === "economy") {
        const findBus = await bus.findOne({ _id: findBooking.busid });
        let availableSeats = findBus.economySeatsAvailable;

        const set = new Set(findBus.economySeatsAvailable);
        const result = findBooking.seatNumber.filter((x) => set.has(x));
        if (findBooking.seatNumber.length !== result.length) {
          availableSeats = availableSeats.concat(findBooking.seatNumber);
          availableSeats = availableSeats.sort((a, b) => a - b);
          const update = await bus.updateOne(
            { _id: findBooking.busid },
            { $set: { economySeatsAvailable: availableSeats } }
          );
          const deleteBooking = await booking.deleteOne({ _id: req.params.id });
          res.json(deleteBooking);
        } else {
          res.json({
            message: "Some of the seats are not valid",
          });
        }
      } else if (findBooking.ticketCategory === "business") {
        const findBus = await bus.findOne({ _id: findBooking.busid });
        let availableSeats = findBus.businessSeatsAvailable;

        const set = new Set(findBus.businessSeatsAvailable);
        const result = findBooking.seatNumber.filter((x) => set.has(x));
        if (findBooking.seatNumber.length !== result.length) {
          availableSeats = availableSeats.concat(findBooking.seatNumber);
          availableSeats = availableSeats.sort((a, b) => a - b);
          const update = await bus.updateOne(
            { _id: findBooking.busid },
            { $set: { businessSeatsAvailable: availableSeats } }
          );
          const deleteBooking = await booking.deleteOne({ _id: req.params.id });
          res.json(deleteBooking);
        } else {
          res.json({
            message: "Some of the seats are not valid",
          });
        }
      }
    } else {
      res.json({
        message: "Booking not found",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const specificUserbooking = async (req, res) => {
  try {
    const findUserBooking = await booking.find({ userid: req.params.userId });
    if (findUserBooking) {
      res.json(findUserBooking);
    } else {
      res.json({
        message: "User has no booking",
      });
    }
  } catch (err) {
    res.json(err);
  }
};
module.exports = {
  newBooking,
  detailSpecificBooking,
  cancelBooking,
  specificUserbooking,
};
