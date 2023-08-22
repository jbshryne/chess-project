const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 6464;
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const methodOverride = require("method-override");
const authRoutes = require("./controllers/authController");
const gameRoutes = require("./controllers/gameController");
const User = require("./models/user");
const Game = require("./models/game")
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session({ secret: "PompomElves", cookie: { maxAge: 720000 } }));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/dburl", (req, res) => {
  res.send("Connection URL: " + process.env.DATABASE_URL);
});

// seed route
app.get("/seed", async (req, res) => {
  await User.deleteMany({});
  await Game.deleteMany({})
  await User.create([
    {
      username: "jbshryne",
      password: "$2b$10$52P0HvdwUz/.xLlKdPMDNuPQbL0cg7e7zVr6cN3mV6pP2jOg0H7PS",
      name: "Jon",
    },
    {
      username: "otfgoon",
      password: "$2b$10$HQ.w8ilKUmMV/B2NvrkjxeZDxdVRmqmgSs2.ebsYTcNNyIRbNnmJ6",
      name: "Ollie",
    },
  ]);
  // await User.find()
  res.redirect("/");
});

app.use(authRoutes);

app.use((req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
    return;
  }
  next();
});

app.use("/games", gameRoutes);

app.listen(PORT, () => console.log(PORT, "is groovin'"));
