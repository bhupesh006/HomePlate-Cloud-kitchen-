import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: CustomerLoginPage ---
const CustomerLoginPage = ({ onLoginSuccess, onShowNotification }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isSignup, setIsSignup] = useState(false);
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.customerLogin(credentials);
            onLoginSuccess(response.data.user, response.data.token); 
            onShowNotification('Login successful!');
        } catch (error) {
            const msg = error.response?.data?.error || 'Invalid credentials or server error.';
            onShowNotification(msg);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.customerRegister(signupData);
            onShowNotification(response.data.message || 'Account created! Please login.');
            setIsSignup(false);
        } catch (error) {
            const msg = error.response?.data?.error || 'Registration failed.';
            onShowNotification(msg);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">
                        {isSignup ? 'Customer Sign Up' : 'Customer Login'}
                    </h2>
                    {!isSignup ? (
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                            >
                                Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={signupData.name}
                                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={signupData.phone}
                                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                                <textarea
                                    value={signupData.address}
                                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                                <input
                                    type="password"
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                            >
                                Sign Up
                            </button>
                        </form>
                    )}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsSignup(!isSignup)}
                                className="text-orange-500 font-semibold hover:underline"
                            >
                                {isSignup ? 'Login' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLoginPage;
