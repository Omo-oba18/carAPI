const express = require("express");
const router = express.Router();
const { verifyRiderToken } = require("../middleware/authMiddleware");
const riderController = require("../controller/riderController");

// Update Rider Profile route
router.get("/profile", verifyRiderToken, riderController.updateRiderProfile);
router.put(
  "/update-profile",
  verifyRiderToken,
  riderController.getRiderProfile
);
router.post("/request-ride", verifyRiderToken, riderController.requestRide);
router.delete(
  "/cancel-ride/:rideRequestId",
  verifyRiderToken,
  riderController.cancelRideRequest
);
router.get(
  "/nearest-drivers",
  verifyRiderToken,
  riderController.getNearestDrivers
);

module.exports = router;
