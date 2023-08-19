const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 6464
const NODE_VERSION = "14.17.0"
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const methodOverride = require("method-override")
const authRoutes = require("./controllers/authController");
const gameRoutes = require("./controllers/gameController");
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.use(session({ secret: "PompomElves", cookie: { maxAge: 720000 } }));

app.get("/dburl", (req, res) => {
    res.send("Connection URL: " + process.env.DATABASE_URL)
})

app.use(authRoutes);

// app.use((req, res, next) => {
//     if (!req.session.userId) {
//       res.redirect("/login");
//       return;
//     }
//     next()
//   });

app.use("/games", gameRoutes);

app.listen(PORT, () => console.log(PORT, "is groovin'"));
