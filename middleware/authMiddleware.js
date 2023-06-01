const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user ID from the decoded token
    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists and has the role property set to "rider"
    if (!user || user.role !== "rider") {
      return res
        .status(401)
        .json({ message: "Unauthorized. User is not a rider." });
    }

    // Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Authentication failed. Please provide a valid token.",
    });
  }
};

// Middleware to verify token
const verifyToken = (role) => async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== role) {
      throw new Error();
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  authMiddleware,
  verifyDriverToken: verifyToken("driver"),
  verifyRiderToken: verifyToken("rider"),
  verifyAdminToken: verifyToken("admin"),
};
