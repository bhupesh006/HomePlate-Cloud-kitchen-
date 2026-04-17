const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Customer Registration
router.post('/customer/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ name, email, password: hashedPassword, phone, address, userType: 'customer' });
    await user.save();
    
    const token = jwt.sign( { userId: user._id, userType: 'customer' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' } );
    
    res.status(201).json({ message: 'Customer registered successfully', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, userType: 'customer' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign( { userId: user._id, userType: 'customer' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' } );
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seller Registration
router.post('/seller/register', async (req, res) => {
  try {
    const { businessName, ownerName, username, email, password, phone, address, fssaiNumber } = req.body;
    
    const existingSeller = await Seller.findOne({ $or: [{ email }, { username }] });
    if (existingSeller) return res.status(400).json({ error: 'Email or username already registered' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ businessName, ownerName, username, email, password: hashedPassword, phone, address, fssaiNumber });
    await seller.save();
    
    res.status(201).json({ message: 'Seller registered successfully. Please wait for verification.', seller: { id: seller._id, businessName: seller.businessName } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seller Login
router.post('/seller/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const seller = await Seller.findOne({ username });
    if (!seller) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isValidPassword = await bcrypt.compare(password, seller.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign( { userId: seller._id, userType: 'seller' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' } );
    res.json({ message: 'Login successful', token, seller: { id: seller._id, businessName: seller.businessName, name: seller.businessName, email: seller.email, logoUrl: seller.logoUrl } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Seller Logo
router.patch('/seller/logo', authMiddleware, upload.single('logoFile'), async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Only sellers can update their logo' });
    if (!req.file) return res.status(400).json({ error: 'Logo file is required.' });

    const PORT = process.env.PORT || 5000;
    const logoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    const seller = await Seller.findByIdAndUpdate( req.userId, { logoUrl: logoUrl }, { new: true } );
    if (!seller) return res.status(404).json({ error: 'Seller not found.' });
    
    res.json({ message: 'Logo updated successfully', seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Seller Profile
router.patch('/seller/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userType !== 'seller') return res.status(403).json({ error: 'Access denied' });
    
    const { businessName, email, description, hours } = req.body;
    
    const seller = await Seller.findByIdAndUpdate(
      req.userId,
      { businessName, email, description, hours },
      { new: true }
    );
    
    if (!seller) return res.status(404).json({ error: 'Seller not found.' });
    
    // Return updated fields mapping perfectly to frontend currentUser format
    res.json({ 
      message: 'Profile updated successfully', 
      seller: { 
        id: seller._id, 
        businessName: seller.businessName, 
        name: seller.businessName, 
        email: seller.email, 
        logoUrl: seller.logoUrl,
        description: seller.description,
        hours: seller.hours
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
