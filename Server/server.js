const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const bodyParser = require("body-parser");

const apiRouter = require("./app/apis/api.router");
const db = require("./app/config/db.config");
require("dotenv/config");
require("./scheduler");

global.globalPath = __dirname;
app.use(express.static(path.join(__dirname, "videoContainer")));
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 })
);

getConnection = async () => {
  try {
    await mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 100000,
    });

    console.log("Connection to DB Successful", db.url);
  } catch (err) {
    console.log("Connection to DB Failed");
  }
};

app.get("/", (req, res) => {
  res.json({ message: "Welcome to H5H-Vetting." });
});

app.use("/api", apiRouter);

getConnection();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
