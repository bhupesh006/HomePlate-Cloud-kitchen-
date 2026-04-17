import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: CartPage ---
const CartPage = ({ cart, onUpdateQuantity, onRemoveFromCart, onNavigate, cartTotal }) => (
    <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-8">Your Cart</h2>
            {cart.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 text-lg md:text-xl">Your cart is empty</p>
                    <button
                        onClick={() => onNavigate('menu')}
                        className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item.cartItemId} className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                <img src={item.image} alt={item.name} className="w-full md:w-24 h-48 md:h-24 rounded-lg object-cover" />
                                <div className="flex-1 w-full">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-orange-500 font-bold">₹{item.price} each</p>
                                    {item.instructions && (
                                        <p className='text-xs text-gray-600 mt-1 italic'>**Note to Chef:** {item.instructions}</p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                                            className="bg-gray-800 text-white w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-semibold">Qty: {item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                                            className="bg-gray-800 text-white w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-left md:text-right w-full md:w-auto">
                                    <div className="text-lg md:text-xl font-bold text-gray-800 mb-3">₹{item.price * item.quantity}</div>
                                    <button
                                        onClick={() => onRemoveFromCart(item.cartItemId)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-orange-500 text-white rounded-xl shadow-lg p-6 text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">Total: ₹{cartTotal}</h3>
                        <button
                            onClick={() => onNavigate('checkout')}
                            className="bg-white text-orange-500 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition w-full md:w-auto"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
);

export default CartPage;
