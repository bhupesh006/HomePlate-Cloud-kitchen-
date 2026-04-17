import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: CheckoutPage ---
const CheckoutPage = ({ cart, cartTotal, onPlaceOrder, onShowNotification, onNavigate }) => {
    const [orderData, setOrderData] = useState({
        address: '',
        payment: 'cod', // Default to COD as payment gateway is removed
        instructions: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const sellerId = cart[0]?.sellerId._id;
        if (!sellerId) {
            onShowNotification("Error: Cart is empty or seller not found.");
            return;
        }

        const orderPayload = {
            items: cart.map(item => ({
                dishId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: cartTotal, // We are not adding delivery fee here, but you could
            deliveryAddress: orderData.address,
            paymentMethod: orderData.payment,
            specialInstructions: orderData.instructions,
            sellerId: sellerId,
        };

        try {
            await orderAPI.createOrder(orderPayload);
            onPlaceOrder(); // This clears the cart
            onShowNotification('Order placed successfully!');
            onNavigate('customerOrders');
        } catch (error) {
            console.error("Error placing order:", error);
            onShowNotification("Error: Could not place order.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-orange-500 text-center mb-6">Checkout</h2>
                    <div className="bg-gray-100 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                        {cart.map(item => (
                            <div key={item.cartItemId} className="flex justify-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr className="my-3" />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Delivery Address *</label>
                            <textarea
                                value={orderData.address}
                                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Payment Method *</label>
                            <select
                                value={orderData.payment}
                                onChange={(e) => setOrderData({ ...orderData, payment: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                            >
                                <option value="cod">Cash on Delivery</option>
                                {/* <option value="online">Online Payment (Disabled)</option> */}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Special Instructions</label>
                            <textarea
                                value={orderData.instructions}
                                onChange={(e) => setOrderData({ ...orderData, instructions: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                rows="2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Place Order (₹{cartTotal})
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
