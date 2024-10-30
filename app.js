const express = require("express");
const cors = require("cors");
const connection = require("./config/DB");
const contactRouter = require("./routes/contact.routes");
const userRouter = require("./routes/user.routes");
const ContactModel = require("./model/ContatcUs");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://genuine-client.vercel.app/"], // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    credentials: true, // Allow credentials (optional)
  })
);

app.use(express.json());

app.use("/form", contactRouter);
app.use("/auth", userRouter);

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
