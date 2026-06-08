const express = require('express');
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
});

// CREATE FOOD
router.post(
    '/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// GET ALL FOODS
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