const mongoose = require('mongoose')
const {Schema, model} = mongoose

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: String,
    games: [{ ref: "Game", type: mongoose.Schema.Types.ObjectId }]
})

const User = new model("User", userSchema)

module.exports = User