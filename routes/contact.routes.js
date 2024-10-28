const express = require("express");
const multer = require("multer");
const { saveContact } = require("../controller/ContactUs.controller");
const contactRouter = express.Router();

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route to save contact with image uploads
contactRouter.post("/contacts", upload.array("images", 10), saveContact); // Allows up to 10 images

module.exports = contactRouter;
