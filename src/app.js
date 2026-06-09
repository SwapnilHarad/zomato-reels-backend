//Role of this file it to create server

const express = require('express');
const cookieparser = require('cookie-parser');
const authRoutes  = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const cors = require('cors');
const foodPartnerRoutes = require('./routes/food-partner.routes');



const app = express();
app.set('trust proxy', 1); // add this line
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
app.use(cors({
   origin: [
        "http://localhost:5173",
        "https://zomato-reels-frontend.vercel.app"
    ],
    credentials: true
}));



app.get("/", (req,res)=>{
    res.send('Backend is working'); 
})


app.use('/api/auth',authRoutes);
app.use('/api/food',foodRoutes);
app.use('/api/food-partner',foodPartnerRoutes);

module.exports = app;