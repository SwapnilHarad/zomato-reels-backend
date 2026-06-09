const express = require('express');
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Optional: limit video size to 50MB
});

// CREATE FOOD
// Ensure your authFoodPartnerMiddleware is reading 'req.cookies.token'
router.post(
    '/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// GET ALL FOODS
// Using authUserMiddleware here is correct for users to see the feed
router.get(
    '/',
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
);

// DELETE FOOD
router.delete(
    '/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
);

module.exports = router;