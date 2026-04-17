const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Get All Dishes
router.get('/dishes', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let query = { isAvailable: true };
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const dishes = await Dish.find(query).populate('sellerId', 'businessName');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Dish (Seller Only)
router.post('/dishes', authMiddleware, upload.single('imageFile'), async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Only sellers can add dishes' });
    if (!req.file) return res.status(400).json({ error: 'Image file is required.' });

    const PORT = process.env.PORT || 5000;
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    const { name, description, price, category, type, prepTime } = req.body;
    const dish = new Dish({
      sellerId: req.userId,
      name, description, price: Number(price), category, type, prepTime: Number(prepTime), image: imageUrl
    });
    
    await dish.save();
    res.status(201).json({ message: 'Dish added successfully', dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Seller's Dishes
router.get('/seller/dishes', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Access denied' });
    const dishes = await Dish.find({ sellerId: req.userId });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
