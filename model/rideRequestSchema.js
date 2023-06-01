const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

module.exports = RideRequest;
