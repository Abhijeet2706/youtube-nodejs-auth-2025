const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    //getting the auth header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];    //Taking the first token where it holds the user information
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied, No token find"
        })
    };

    //verifying  the token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
};


module.exports = authMiddleware