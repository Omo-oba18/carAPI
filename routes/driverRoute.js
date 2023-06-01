const express = require("express");
const router = express.Router();
const driverController = require("../controller/driverController");
const { verifyDriverToken } = require("../middleware/authMiddleware");

// Get Driver Profile
router.get("/profile", verifyDriverToken, driverController.getDriverProfile);
router.put(
  "/availability",
  verifyDriverToken,
  driverController.setDriverAvailability
);

module.exports = router;
