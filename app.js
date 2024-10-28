const express = require("express");
const cors = require("cors");
const connection = require("./config/DB");
const contactRouter = require("./routes/contact.routes");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/form", contactRouter);

app.get("/", (req, res) => {
  res.send("hello from server Auto Mobile");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
  console.log("server is running");
});
