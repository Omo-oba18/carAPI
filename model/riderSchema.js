const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  riderId: { type: String, required: true },
  paymentDetails: { type: String, required: true },
  savedAddresses: { type: [String] },
  // Additional rider-specific attributes can be added here
});

const Rider = mongoose.model("Rider", riderSchema);

module.exports = Rider;
