const express = require('express'); 
const foodPartnerController = require('../controllers/food-partner.controller');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure local storage for uploaded profile images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists in your backend root!
    },
    filename: (req, file, cb) => {
        cb(null, 'partner-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Existing GET Profile endpoint
router.get("/:id", foodPartnerController.getFoodPartnerById);

// --- NEW ROUTE: UPDATE PROFILE IMAGE ---
// URL: PUT /api/food-partner/update-image/:id
router.put("/update-image/:id", upload.single('profileImage'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Generate the file url (assuming your backend serves static assets from /uploads)
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        
        const foodPartnerModel = require('../models/foodpartner.model');
        const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
            id,
            { profileImage: imageUrl },
            { new: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.status(200).json({ 
            message: "Profile image updated successfully", 
            profileImage: imageUrl 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating profile picture" });
    }
});

module.exports = router;