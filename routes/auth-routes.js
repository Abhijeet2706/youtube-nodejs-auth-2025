const express = require("express");
const {
    loginUser,
    registerUser
} = require("../controllers/auth-controller");


const router = express.Router();

//all routes are releated to authentication and authorization
router.post('/register', registerUser);
router.post('/login', loginUser)



module.exports = router