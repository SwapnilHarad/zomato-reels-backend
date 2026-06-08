const foodModel = require("../models/food.model");
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    try {
        const fileUploadResult = await storageService.uploadFile(
            req.file.buffer,
            uuid()
        );

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        });

    } catch (error) {
        console.error("Error creating food:", error);

        res.status(500).json({
            message: "Error creating food item"
        });
    }
}

async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel
            .find({})
            .populate('foodPartner');

        res.status(200).json({
            message: "Food Items fetched successfully",
            foodItems
        });

    } catch (error) {
        console.error("Error fetching foods:", error);

        res.status(500).json({
            message: "Error fetching food items"
        });
    }
}

async function deleteFood(req, res) {
    try {
        const { id } = req.params;

        const foodItem = await foodModel.findById(id);

        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        await foodModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Food item deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting food:", error);

        res.status(500).json({
            message: "Error deleting food item"
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    deleteFood
};