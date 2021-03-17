const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const bodyParser = require("body-parser");
const userModel = require("./models/user");

const app = express();
const port = 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use(bodyParser.json());

mongoose.connect(
    "mongodb://localhost:27017/express_login",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Database connected");
    }
);


app.post("/users", async (req, res) => {
    try {
        if (req.body.password.length < 8) {
            res.status(400).json({ message: "Please choose a password with at least 8 characters." });
            return;
        }

        // if (req.body.confirmPassword !== req.body.password) {
        //     res.status(400).json({ message: "Your password and confirmation password do not match. Please try again." })
        //     return;
        // }

        await userModel.create({
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password),
            firstName: req.body.firstName,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth
        });
        res.status(200).json({ message: "Your account has been created." });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong.",
            error: err.toString()
        });
    }
});

app.post("/login", async (req, res) => {
    const user = await userModel
        .findOne({
            email: req.body.email
        })
        .exec();
})