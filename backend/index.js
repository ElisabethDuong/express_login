const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const config = require("./config");

const app = express();

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});

app.use(bodyParser.json());

mongoose.connect(
    config.mongoDB,
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

        if (req.body.confirmPassword !== req.body.password) {
            res.status(400).json({ message: "Your password and confirmation password do not match. Please try again." })
            return;
        }

        await userModel.create({
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password),
            firstName: req.body.firstName,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth
        });
        res.status(201).json({ message: "Your account has been created." });
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

    if (bcryptjs.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                id: user._id
            },
            config.secret,
            {
                expiresIn: 3600
            }
        );
    } else {
        res.status(401).send("The password is invalid. Please try again.");
    }
});
