const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Dish = require('./models/Dish');
const connectDB = require('./config/db');

const updateImages = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const updates = [
            { name: "Idli Sambar", image: "http://localhost:5000/uploads/idli_sambar.png" },
            { name: "Medu Vada", image: "http://localhost:5000/uploads/medu_vada.png" },
            { name: "Masala Dosa", image: "http://localhost:5000/uploads/masala_dosa.png" },
            { name: "Hyderabadi Chicken Biryani", image: "http://localhost:5000/uploads/chicken_biryani.png" }
        ];

        let count = 0;
        for (const update of updates) {
            const result = await Dish.updateMany(
                { name: update.name },
                { $set: { image: update.image } }
            );
            count += result.modifiedCount;
            console.log(`Updated ${result.modifiedCount} matches for ${update.name}`);
        }

        console.log(`Successfully updated ${count} total documents!`);
        process.exit(0);

    } catch (error) {
        console.error("Error updating dishes:", error);
        process.exit(1);
    }
}

updateImages();
