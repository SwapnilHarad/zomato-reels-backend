const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    fullName:{
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
    // --- ADDED FOR FORGOT PASSWORD ---
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
},
{
    timestamps :true
})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;