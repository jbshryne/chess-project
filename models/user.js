const mongoose = require("../db/connection");
const {Schema, model} = mongoose

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    // userName: String,
    // password: String,
    // name: String,
    email: String,
    games: [{ ref: "Game", type: mongoose.Schema.Types.ObjectId }]
})

const User = new model("User", userSchema)

module.exports = User