const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  fullname: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  description: { type: String },
  image: { type: [String], require: true, default: [] },
  status: {
    type: String,
    enum: ["pending", "rejected", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now }, // Automatically set to the current date
  updatedAt: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("ContactUs", contactSchema);

module.exports = ContactModel;
