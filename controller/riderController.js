const Driver = require("../model/driverSchema");
const RideRequest = require("../model/rideRequestSchema");
const Rider = require("../model/riderSchema");
const User = require("../model/userSchema");

//
const getRiderProfile = async (req, res) => {
  try {
    // Check if the user's role is set to "rider"
    if (req.user.role !== "rider") {
      return res
        .status(403)
        .json({ message: "Unauthorized access. User is not a rider." });
    }

    const rider = await Rider.findOne({ user: req.user.id }).populate(
      "user",
      "-password"
    );
    if (!rider) {
      return res.status(404).json({ message: "Rider profile not found" });
    }

    res.status(200).json({ rider });
  } catch (error) {
    console.error("Error getting rider profile:", error);
    res.status(500).json({
      message:
        "An error occurred while getting the rider profile. Please try again later.",
    });
  }
};

// Update Rider Profile
const updateRiderProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated rider
    const userId = req.user._id;

    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract updated profile data from the request body
    const { name, address, phoneNumber, savedAddress, paymentDetails } =
      req.body;

    // Update the user's profile if new values are provided
    if (name) user.name = name;
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Save the updated user profile
    await user.save();

    // Find or create the rider entry
    let rider = await Rider.findOne({ user: userId });

    if (!rider) {
      rider = new Rider({
        user: userId,
        savedAddress,
        paymentDetails,
      });
    } else {
      // Update the rider's profile if new values are provided
      if (savedAddress) rider.savedAddress = savedAddress;
      if (paymentDetails) rider.paymentDetails = paymentDetails;
    }

    // Save the updated rider profile
    await rider.save();

    res.json({ message: "Rider profile updated successfully", user, rider });
  } catch (error) {
    console.error("Error updating rider profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// request a ride
const requestRide = async (req, res) => {
  try {
    // Extract the necessary data from the request body
    const { pickupLocation, destination } = req.body;

    // Create a new ride request
    const rideRequest = new RideRequest({
      rider: req.userId, // Assuming you have the user ID stored in the req.userId
      pickupLocation,
      destination,
      status: "pending", // Set the initial status as pending
    });

    // Save the ride request to the database
    await rideRequest.save();

    // Send a response indicating success
    res
      .status(200)
      .json({ message: "Ride requested successfully", rideRequest });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error requesting a ride:", error);
    res
      .status(500)
      .json({ error: "An error occurred while requesting a ride" });
  }
};

// route that can help the rider to cancel the ride request

const cancelRideRequest = async (req, res) => {
  try {
    const rideRequestId = req.params.rideRequestId;

    // Find the ride request in the database
    const rideRequest = await RideRequest.findById(rideRequestId);

    // Check if the ride request exists
    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    // Check if the ride request is already canceled
    if (rideRequest.status === "canceled") {
      return res
        .status(400)
        .json({ message: "Ride request is already canceled" });
    }

    // Update the ride request status to 'canceled'
    rideRequest.status = "canceled";

    // Save the updated ride request
    await rideRequest.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Ride request canceled successfully" });
  } catch (error) {
    // Handle any errors that occur during the cancellation process
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while canceling the ride request",
    });
  }
};

// get the available and nearest driver

const getNearestDrivers = async (req, res) => {
  try {
    // Fetch all drivers who are available and not assigned to a ride request
    const drivers = await Driver.find({ isAvailable: true, rideRequest: null });

    res.json({ drivers });
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateRiderProfile,
  getRiderProfile,
  requestRide,
  cancelRideRequest,
  getNearestDrivers,
};
