const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://filet_o_ghoti:4nfrKP5uWM2ubw!@cluster0.q3qxvem.mongodb.net/ChessMixed"
);

mongoose.connection.on("connected", () => {console.log("connected!")})
mongoose.connection.on("error", () => {console.log("uh-oh, error!")})

module.exports = mongoose;
