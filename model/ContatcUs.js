const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  fullname: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  description: { type: String },
  image: { type: [String], require: true, default: [] },
});

const ContactModel = mongoose.model("ContactUs", contactSchema);

module.exports = ContactModel;
