const AWS = require("aws-sdk");
const uuid = require("uuid");
const ContactModel = require("../model/ContatcUs");

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
    console.error("Error saving contact:", error);
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

module.exports = {
  saveContact,
};
