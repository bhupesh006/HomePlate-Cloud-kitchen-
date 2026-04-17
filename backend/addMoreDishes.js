const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Seller = require('./models/Seller');
const Dish = require('./models/Dish');
const connectDB = require('./config/db');

const newDishes = [
    {
        name: "Paneer Butter Masala",
        description: "Soft paneer cubes simmered in a creamy, mildly spiced tomato gravy.",
        price: 220,
        category: "main-course",
        type: "veg",
        prepTime: 20,
        rating: 4.7,
        image: "http://localhost:5000/uploads/paneer_butter_masala.png",
        isAvailable: true
    },
    {
        name: "Garlic Naan",
        description: "Soft, buttery Indian bread topped with roasted garlic and herbs.",
        price: 60,
        category: "main-course",
        type: "veg",
        prepTime: 10,
        rating: 4.8,
        image: "http://localhost:5000/uploads/garlic_naan.png",
        isAvailable: true
    },
    {
        name: "Mutton Rogan Josh",
        description: "Aromatic and rich Kashmiri mutton curry packed with deep flavors.",
        price: 320,
        category: "main-course",
        type: "non-veg",
        prepTime: 30,
        rating: 4.9,
        image: "http://localhost:5000/uploads/mutton_rogan_josh.png",
        isAvailable: true
    }
];

const seedDishes = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const sellers = await Seller.find();
        if (sellers.length === 0) {
            console.log('No sellers found.');
            process.exit(0);
        }

        let addedCount = 0;

        for (const seller of sellers) {
            for (const dishTemplate of newDishes) {
                const existingDish = await Dish.findOne({ sellerId: seller._id, name: dishTemplate.name });
                if (!existingDish) {
                    const newDish = new Dish({
                        ...dishTemplate,
                        sellerId: seller._id
                    });
                    await newDish.save();
                    addedCount++;
                }
            }
        }

        console.log(`Successfully added ${addedCount} new dishes!`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding dishes:", error);
        process.exit(1);
    }
}

seedDishes();
