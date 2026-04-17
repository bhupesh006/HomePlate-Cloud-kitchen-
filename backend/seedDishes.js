const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Seller = require('./models/Seller');
const Dish = require('./models/Dish');
const connectDB = require('./config/db');

const southIndianDishes = [
    {
        name: "Masala Dosa",
        description: "Crispy rice crepe filled with spiced potato curry. Served with sambar and coconut chutney.",
        price: 120,
        category: "main-course",
        type: "veg",
        prepTime: 15,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60",
        isAvailable: true
    },
    {
        name: "Idli Sambar",
        description: "Soft steamed rice cakes served with hot lentil sambar and fresh chutney.",
        price: 80,
        category: "appetizer",
        type: "veg",
        prepTime: 10,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60",
        isAvailable: true
    },
    {
        name: "Hyderabadi Chicken Biryani",
        description: "Aromatic basmati rice cooked with tender chicken pieces and secret spices.",
        price: 250,
        category: "main-course",
        type: "non-veg",
        prepTime: 25,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&auto=format&fit=crop&q=60",
        isAvailable: true
    },
    {
        name: "Medu Vada",
        description: "Crispy savory donut-shaped fritters made from urad dal.",
        price: 60,
        category: "appetizer",
        type: "veg",
        prepTime: 10,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=60",
        isAvailable: true
    }
];

const seedDishes = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const sellers = await Seller.find();
        if (sellers.length === 0) {
            console.log('No sellers found. Create a seller first.');
            process.exit(0);
        }

        let addedCount = 0;

        for (const seller of sellers) {
            for (const dishTemplate of southIndianDishes) {
                // Check if seller already has a dish with this name to prevent duplicates
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

        console.log(`Successfully added ${addedCount} South Indian dishes across ${sellers.length} sellers!`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding dishes:", error);
        process.exit(1);
    }
}

seedDishes();
