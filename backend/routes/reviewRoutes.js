const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middlewares/authMiddleware');

// Add Review (Customer Only)
router.post('/reviews', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'customer') return res.status(403).json({ error: 'Only customers can write reviews' });
    const { orderId, sellerId, rating, comment } = req.body;

    const existingReview = await Review.findOne({ orderId: orderId, customerId: req.userId });
    if (existingReview) return res.status(400).json({ error: 'You have already reviewed this order.' });

    const review = new Review({ orderId, sellerId, customerId: req.userId, rating, comment });
    await review.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Seller Reviews
router.get('/seller/:sellerId/reviews', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const reviews = await Review.find({ sellerId: sellerId }).populate('customerId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
