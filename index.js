const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MONGO_URL, PORT } = process.env;
const authRoute = require("./routes/authRoute");
const rideRoute = require("./routes/riderRoute");
const driverRoute = require("./routes/driverRoute");
const { authMiddleware } = require("./middleware/authMiddleware");

const options = {
  dbName: "rideb", // Specify the custom database name here
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// connection to cluster
mongoose
  .connect(MONGO_URL, options)
  .then(() => {
    console.log("Connected to MongoDB");
    // Continue with your application logic
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Mount routes
app.get("/", (req, res) => {
  // Handle the root URL request
  res.send("Welcome to the homepage");
});

// Other middleware and configurations...

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/ride", authMiddleware, rideRoute);
app.use("/api/driver", authMiddleware, driverRoute);
