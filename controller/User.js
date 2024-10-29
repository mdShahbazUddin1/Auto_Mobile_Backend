const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Optional, for generating JWT tokens
const UserModel = require("../model/UserModel");

// Create a new user (Register)
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, admin } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      admin: admin || false, // Default to false if not provided
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        admin: newUser.admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Optionally generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "your_jwt_secret"
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        admin: user.admin,
      },
      token, // Return the token to the client
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = {
  createUser,
  loginUser,
};
