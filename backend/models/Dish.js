const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ['appetizer', 'main-course', 'dessert', 'beverage'], required: true },
  type: { type: String, enum: ['veg', 'non-veg'], required: true },
  prepTime: Number,
  rating: { type: Number, default: 4.0 },
  image: String,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dish', dishSchema);
