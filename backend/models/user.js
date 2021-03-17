const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    surname: String,
    dateOfBirth: Date
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;