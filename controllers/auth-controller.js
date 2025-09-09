


const express = require("express");
const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


//need a register controller
const registerUser = async (req, res) => {
    try {
        //extracting a user information from our request 
        const userData = req.body;
        const {
            userName,
            email,
            password, role
        } = userData;

        //checking if the user is already exist in our database;

        const checkExistingUser = await User.findOne({ $or: [{ userName }, { email }] })
        if (checkExistingUser) {
            res.status(400).json({
                success: false,
                message: "User is already registed with the same email or userName, Please try with the different userName and email"
            })
        } else {
            //hasing the user password
            const salt = await bycrypt.genSalt(10);
            const hashedPassword = await bycrypt.hash(password, salt);


            //creating a new user and save in the database
            const newelyCreatedUser = new User({
                userName,
                email,
                password: hashedPassword,
                role: role || "user"
            });
            await newelyCreatedUser.save();

            if (newelyCreatedUser) {
                res.status(200).json({
                    success: true,
                    message: "User registered successfully"
                })

            } else {
                res.status(400).json({
                    success: true,
                    message: "User register failed"
                })
            }
        }

    } catch (err) {
        console.log("err", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


//login controller
const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        //finc if the current user is exists in database or not
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User does not exists"
            });
        }

        //if the password is correct or not
        const isPasswordMatch = await bycrypt.compare(password, user?.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid credentails"
            });
        };

        //create userToken by using jsonwebtoken
        const accessToken = jwt.sign({
            userId: user._id,
            userName: user.userName,
            role: user.role
        },

            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        res.status(200).json({
            success: true,
            message: "Loggedin successfully",
            accessToken
        })
    } catch (err) {
        console.log("err", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

module.exports = {
    loginUser,
    registerUser
}