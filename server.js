const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(require("./Router/auth"));
app.use(require("./Router/post"));
app.use(require("./Router/User"));
require("./Model/User");
require("./Model/Post");
const { MONGOURL } = require("./config/dev");

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  app.listen(PORT, () => {
    console.log(`server running on Port ${PORT}`);
  });
  console.log("conneted to mongo yeahh");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
