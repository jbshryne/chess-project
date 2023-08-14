const express = require("express");
const app = express();
require('dotenv').config()

console.log(process.env)


const PORT = process.env.PORT
app.listen(PORT, () => console.log(PORT, "is groovin'"))