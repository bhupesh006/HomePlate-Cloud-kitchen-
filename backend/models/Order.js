const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  items: [{
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
  status: { type: String, enum: ['new', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'new' },
  specialInstructions: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
