const express = require("express");
require("./config/config");

// ALL THE ROUTES HERE
const userRouters = require("./routes/usersRoutes");
const busRouters = require("./routes/busRoutes");
const adminRouters = require("./routes/adminRoutes");
const bookingsRouters = require("./routes/bookingRoutes");

const app = express();

app.use("/api/users", userRouters);
app.use("/api/buses", busRouters);
app.use("/api/admin", adminRouters);
app.use("/api/bookings", bookingsRouters);

process.on("uncaughtException", (error) => {
  console.log("Oh my god, something terrible happened: ", error);
  process.exit(0); // exit application
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
