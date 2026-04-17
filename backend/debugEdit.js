const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const Seller = require('./models/Seller');
const connectDB = require('./config/db');

const testUpdate = async () => {
    try {
        await connectDB();
        const seller = await Seller.findOne(); // Grab the first seller (Indu's Kitchen)
        console.log("Found seller:", seller);

        const updated = await Seller.findByIdAndUpdate(
            seller._id,
            { 
               businessName: seller.businessName, 
               email: seller.email, 
               description: 'Testing edit', 
               hours: '9 - 11' 
            },
            { new: true, runValidators: true }
        );

        console.log("Updated carefully:", updated);
        process.exit();
    } catch(e) {
        console.error("Error:", e.message);
        process.exit();
    }
}
testUpdate();
