const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const authMiddleware = require('../middlewares/authMiddleware');

// Create Order (Customer Only)
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'customer') return res.status(403).json({ error: 'Only customers can place orders' });
    const { items, totalAmount, deliveryAddress, paymentMethod, specialInstructions, sellerId } = req.body;
    const order = new Order({ customerId: req.userId, sellerId, items, totalAmount, deliveryAddress, paymentMethod, specialInstructions });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Customer Orders
router.get('/customer/orders', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'customer') return res.status(403).json({ error: 'Access denied' });
    const orders = await Order.find({ customerId: req.userId }).populate('items.dishId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Seller Orders
router.get('/seller/orders', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Access denied' });
    const orders = await Order.find({ sellerId: req.userId }).populate('customerId', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Status
router.patch('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Only sellers can update order status' });
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate({ _id: orderId, sellerId: req.userId }, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seller Dashboard Stats
router.get('/seller/stats', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Access denied' });
    const totalOrders = await Order.countDocuments({ sellerId: req.userId });
    const totalDishes = await Dish.countDocuments({ sellerId: req.userId });
    const orders = await Order.find({ sellerId: req.userId });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const dishes = await Dish.find({ sellerId: req.userId });
    const avgRating = dishes.length > 0 ? dishes.reduce((sum, dish) => sum + dish.rating, 0) / dishes.length : 0;
    
    res.json({ totalOrders, totalDishes, totalRevenue, avgRating: avgRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
