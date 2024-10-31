const AWS = require("aws-sdk");
const uuid = require("uuid");
const ContactModel = require("../model/ContatcUs");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWSACCESSKEYID,
  secretAccessKey: process.env.AWSSECRETKEY,
  region: process.env.AWSREGION,
});

const s3 = new AWS.S3();

const saveContact = async (req, res) => {
  try {
    const { fullname, phone, email, description } = req.body;
    const imageURLs = [];

    if (req.files && req.files.length > 0) {
      // Iterate over the files in req.files
      for (const file of req.files) {
        const imageKey = `images/${uuid.v4()}-${file.originalname}`;
        await uploadToS3(imageKey, file.buffer, file.mimetype);
        const imageURL = `https://blog-website-s3.s3.amazonaws.com/${imageKey}`;
        imageURLs.push(imageURL);
      }
    }

    // Create new contact with the array of image URLs
    const newContact = new ContactModel({
      fullname,
      phone,
      email,
      description,
      image: imageURLs,
    });

    await newContact.save();

    res.status(201).send({ msg: "Contact saved successfully", newContact });
  } catch (error) {
    console.error("Error saving contact:", error.message);
    res
      .status(500)
      .send({ msg: "Internal server error", error: error.message });
  }
};

const uploadToS3 = (key, buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: "blog-website-s3",
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};
const getAllContacts = async (req, res) => {
  try {
    // Fetch all contacts from the database
    const contacts = await ContactModel.find(); // You can add sorting, filtering, or pagination as needed

    // Send the retrieved contacts as a response
    res.status(200).send({ msg: "Contacts retrieved successfully", contacts });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res
      .status(500)
      .send({ msg: "Internal server error", error: error.message });
  }
};

const updateStatusById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Ensure that the status is valid
  const allowedStatuses = ["pending", "rejected", "completed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const contact = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Status updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
const getPendingContacts = async (req, res) => {
  try {
    const pendingContacts = await ContactModel.find({ status: "completed" });
    res.status(200).json({ contacts: pendingContacts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending contacts", error });
  }
};

// Controller function to get all rejected contacts
const getRejectedContacts = async (req, res) => {
  try {
    const rejectedContacts = await ContactModel.find({ status: "rejected" });
    res.status(200).json({ contacts: rejectedContacts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rejected contacts", error });
  }
};

const getPendingNotifications = async (req, res) => {
  try {
    // Fetch the latest pending notifications and populate user's full name
    const pendingNotifications = await ContactModel.find({
      status: "pending",
      seen: false,
    }).sort({ createdAt: -1 });
    // Send the pending notifications in response
    res.status(200).json({ notifications: pendingNotifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending notifications", error });
  }
};

const markAllNotificationsAsSeen = async (req, res) => {
  try {
    // Update all notifications to set `seen` as true
    await ContactModel.updateMany({}, { seen: true });

    // Respond with success message
    res.status(200).json({ message: "All notifications marked as seen." });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
  }
};

module.exports = {
  saveContact,
  getAllContacts,
  updateStatusById,
  getPendingContacts,
  getRejectedContacts,
  getPendingNotifications,
  markAllNotificationsAsSeen,
};
