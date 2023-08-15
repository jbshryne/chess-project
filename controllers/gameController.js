const express = require("express");
const router = express.Router();
const Game = require('../models/game');

// show route
router.get("/games", (req, res) => {
    res.send("Your Games")
})

module.exports = router