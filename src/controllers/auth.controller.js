const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 

// --- PRODUCTION COOKIE OPTIONS ---
// This ensures cookies work across domains (Render -> Vercel) and stay logged in for 24 hours.
const cookieOptions = {
    httpOnly: true,
    secure: true,        // MUST be true for HTTPS (Render/Vercel)
    sameSite: "none",    // MUST be "none" for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

async function registerUser(req, res){
    const {fullName, email, password} = req.body;

    const isUserAleadyExists = await userModel.findOne({ email })

    if(isUserAleadyExists){
        return res.status(400).json({
            message: "User Already Exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10 );

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    // Apply standardized cookie options
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        message: "User Registered succesfully",
        user:{
            _id: user._id,
            email: user.email,
            fullname: user.fullName 
        }
    })
}

async function loginUser (req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid =  await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
         return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "Loggedin Succesfully",
        user:{
            _id: user._id,
            email: user.email,
            fullname: user.fullName 
        }
    })
}

async function logoutUser (req, res){
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "User logged out Succesfully"
    })
}

// --- NEW FORGOT PASSWORD LOGIC ---
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        // FIXED: Point this to your live Vercel Frontend URL using an environment variable
        // Fallback to localhost if the environment variable isn't set
        const frontendURL = process.env.FRONTEND_URL || 'https://zomato-reels-frontend.vercel.app';
        const resetURL = `${frontendURL}/user/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Zomato Reels - Password Reset Request',
            html: `
                <h3>You requested a password reset</h3>
                <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
                <a href="${resetURL}" style="display:inline-block; padding:10px 20px; background-color:#a855f7; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent successfully!" });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Error sending reset email. Please try again later." });
    }
}

async function registerFoodPartner (req, res){
    const {name , email , password, phone , address , contactName} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email })

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message: "User Already Exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10 );

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        message: "User Registered succesfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            phone: foodPartner.phone,
            address: foodPartner.address,
            contactName: foodPartner.contactName
        }
    })
}

async function loginFoodPartner(req, res){
    const {email , password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email })

    if(!foodPartner){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid =  await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
         return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions);
    
    res.status(200).json({
        message: "Loggedin Succesfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name 
        }
    })
}

function logoutFoodPartner(req, res){
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "FoodPartner logged out Succesfully"
    })
}

module.exports ={
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword, 
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}