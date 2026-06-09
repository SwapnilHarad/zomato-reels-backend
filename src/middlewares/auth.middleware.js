const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
    // 1. Get token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please Login First (No Token)" });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find partner AND verify they exist
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({ message: "Unauthorized - Partner not found" });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        // Log the actual error on the server side so you can debug in Render logs
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please Login First (No Token)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find user AND verify they exist
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};