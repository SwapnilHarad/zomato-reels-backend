const foodPartnerModel = require('../models/foodPartner.model');
// 1. WE ADDED THIS: Import the food model so we can search for the videos
const foodModel = require('../models/food.model'); 

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;

        // 2. Find the Food Partner details (Name, Address, etc.)
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food Partner not found"
            });
        }

        // 3. WE ADDED THIS: Find ALL videos where the foodPartner matches this ID
        const partnerReels = await foodModel.find({ foodPartner: foodPartnerId });

        // 4. Send BOTH the partner info AND their videos back to React
        res.status(200).json({
            message: "Food Partner and Reels found",
            foodPartner: foodPartner,
            reels: partnerReels 
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        return res.status(400).json({
            message: "Invalid ID format or Server Error"
        });
    }
}

module.exports = {
    getFoodPartnerById 
};