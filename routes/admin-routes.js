const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware")

const router = express.Router();

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to admin dashboard"
    })
});

module.exports = router