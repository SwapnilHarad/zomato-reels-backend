const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    contactName:{
        type: String,
        required : true
    },
    phone:{
        type: String,
        required : true
    },  
    address:{
        type: String,
        required : true
    },
    email:{
        type : String,
        required:true,
        unique: true
    },
    password:{
        type: String,
    },
    // --- NEW FIELD FOR PROFILE PHOTO ---
    profileImage: {
        type: String,
        default: ""
    }
});

const foodPartnerModel = mongoose.models.foodpartner || mongoose.model("foodpartner", foodPartnerSchema);

module.exports = foodPartnerModel;