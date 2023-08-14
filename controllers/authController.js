const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  if (req.body.username && req.body.password) {
    bcrypt.hash(req.body.password, 10, async (err, hashed) => {
      req.body.password = hashed;

      let newUser = await User.create(req.body);
      res.send(newUser);
    });
  }
});

module.exports = router;
