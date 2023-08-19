const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on("connected", () => {
  console.log("connected!");
});
mongoose.connection.on("error", () => {
  console.log("uh-oh, error!");
});

module.exports = mongoose;
