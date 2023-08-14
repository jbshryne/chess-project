const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
require('dotenv').config()
const authRoutes = require("./controllers/authController");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(session({ secret: "PompomElves", cookie: { maxAge: 720000 } }));

app.use("/auth", authRoutes)

app.get('/chess', (req, res) => {
    res.send("Chess!")
    console.log("chess?");
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(PORT, "is groovin'"))