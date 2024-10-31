const express = require("express");
const multer = require("multer");
const {
  saveContact,
  getAllContacts,
  updateStatusById,
  getPendingContacts,
  getRejectedContacts,
  getPendingNotifications,
  markAllNotificationsAsSeen,
} = require("../controller/ContactUs.controller");
const contactRouter = express.Router();

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route to save contact with image uploads
contactRouter.post("/contacts", upload.array("images", 10), saveContact); // Allows up to 10 images
contactRouter.get("/get", getAllContacts); // Allows up to 10 images
contactRouter.put("/contact/:id/status", updateStatusById);
contactRouter.get("/contacts/pending", getPendingContacts);
contactRouter.get("/contacts/rejected", getRejectedContacts);
contactRouter.get("/notifications/pending", getPendingNotifications);
contactRouter.put("/notifications/markAllAsSeen", markAllNotificationsAsSeen);

module.exports = contactRouter;
