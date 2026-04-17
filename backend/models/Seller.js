const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  fssaiNumber: String,
  isVerified: { type: Boolean, default: false },
  logoUrl: { type: String, default: '' },
  description: { type: String, default: 'Authentic Indian cuisine with modern twist.' },
  hours: { type: String, default: '9:00 AM - 11:00 PM' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);
