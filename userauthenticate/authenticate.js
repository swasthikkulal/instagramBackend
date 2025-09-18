const jwt = require("jsonwebtoken");
require("dotenv").config(); // No need to assign to `env`

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["auth-token"]?.replace(/^"|"$/g, "");
        console.log("Received Token:", token);
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET); // will throw if invalid

        req.user = decoded;
        next(); // proceed to next middleware or route
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token", error: error.message });
    }
};

module.exports = authenticate;
