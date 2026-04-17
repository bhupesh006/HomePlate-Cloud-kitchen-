const { OpenAI } = require('openai');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAIRecommendations = async (userId, cartItems) => {
  try {
    const recommendations = [];
    
    // Get user's order history
    const userOrders = await Order.find({ customerId: userId }).limit(10);
    
    // Analyze cart items
    const hasNonVeg = cartItems.some(item => item.type === 'non-veg');
    const cartCategories = cartItems.map(item => item.category);
    
    // Recommendation 1: Complementary items
    if (hasNonVeg) {
      const breads = await Dish.find({ 
        category: 'main-course', 
        type: 'veg',
        name: { $regex: /chapati|naan|roti/i }
      }).limit(3);
      
      if (breads.length > 0) {
        recommendations.push({
          reason: "Perfect pairing with your selection",
          dishes: breads
        });
      }
    }
    
    // Recommendation 2: Popular items
    const popularDishes = await Dish.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(3);
    
    recommendations.push({
      reason: "Top rated dishes",
      dishes: popularDishes
    });
    
    // Recommendation 3: Similar category items
    if (cartCategories.length > 0) {
      const similarDishes = await Dish.find({
        category: { $in: cartCategories },
        isAvailable: true
      }).limit(3);
      
      if (similarDishes.length > 0) {
        recommendations.push({
          reason: "You might also like",
          dishes: similarDishes
        });
      }
    }
    
    // Recommendation 4: Based on order history
    if (userOrders.length > 0) {
      const orderedDishIds = userOrders.flatMap(order => 
        order.items.map(item => item.dishId)
      );
      
      const historyBasedDishes = await Dish.find({
        _id: { $in: orderedDishIds },
        isAvailable: true
      }).limit(3);
      
      if (historyBasedDishes.length > 0) {
        recommendations.push({
          reason: "Based on your order history",
          dishes: historyBasedDishes
        });
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    return [];
  }
};

module.exports = { openai, getAIRecommendations };
