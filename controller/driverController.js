const Driver = require("../model/driverSchema");
const User = require("../model/userSchema");

// Get Driver Profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select("-password");
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ driver });
  } catch (error) {
    console.error("Error getting driver profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// set driver availability
const setDriverAvailability = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update driver availability
    driver.isAvailable = req.body.isAvailable;
    await driver.save();

    res.json({ message: "Driver availability updated" });
  } catch (error) {
    console.error("Error setting driver availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update driver profile
// Update Rider Profile
const upadteDriverProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated rider
    const userId = req.user._id;

    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract updated profile data from the request body
    const { name, address, phoneNumber, carModel, carPlateNumber } = req.body;

    // Update the user's profile if new values are provided
    if (name) user.name = name;
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Save the updated user profile
    await user.save();

    // Find or create the rider entry
    let driver = await Driver.findOne({ user: userId });

    if (!driver) {
      driver = new Driver({
        user: userId,
        carModel,
        carPlateNumber,
      });
    } else {
      // Update the rider's profile if new values are provided
      if (carModel) driver.carModel = savcarModeledAddress;
      if (carPlateNumber) driver.carPlateNumber = carPlateNumber;
    }

    // Save the updated rider profile
    await driver.save();

    res.json({ message: "Driver profile updated successfully", user, driver });
  } catch (error) {
    console.error("Error updating driver profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDriverProfile,
  upadteDriverProfile,
  setDriverAvailability,
};
