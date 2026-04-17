import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: SellerSignupPage ---
const SellerSignupPage = ({ onShowNotification, onNavigate }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        fssaiNumber: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.sellerRegister(formData);
            onShowNotification(response.data.message || 'Seller account created! Please login.');
            onNavigate('sellerLogin');
        } catch (error) {
            const msg = error.response?.data?.error || 'Registration failed.';
            onShowNotification(msg);
        }
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">Seller Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Business Name *</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Owner Name *</label>
                                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Username *</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">FSSAI License *</label>
                                <input type="text" name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-semibold mb-2">Business Address *</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows="3" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Create Seller Account
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('sellerLogin')}
                                className="text-orange-500 font-semibold hover:underline"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerSignupPage;
