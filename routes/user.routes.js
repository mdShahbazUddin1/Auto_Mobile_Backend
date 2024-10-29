// routes/userRoutes.js
const express = require("express");
const { createUser, loginUser } = require("../controller/User");

const userRouter = express.Router();

// Define the route for creating a new user (Register)
userRouter.post("/register", createUser);

// Define the route for logging in a user
userRouter.post("/login", loginUser);

// Export the router
module.exports = userRouter;
