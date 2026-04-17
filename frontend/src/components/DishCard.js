import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';
import FoodTypeIndicator from './FoodTypeIndicator';

// --- COMPONENT: DishCard ---
const DishCard = ({ dish, onViewDetails }) => {
    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
            onClick={() => onViewDetails(dish)}
        >
            <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{dish.name}</h3>
                    <FoodTypeIndicator type={dish.type} />
                </div>
                <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl md:text-2xl font-bold text-orange-500">₹{dish.price}</span>
                    <div className="flex items-center text-yellow-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(dish.rating) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(dish); }}
                    className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition text-sm md:text-base flex items-center justify-center gap-2"
                >
                    <ShoppingCart className='w-4 h-4' /> View & Order
                </button>
            </div>
        </div>
    );
};

export default DishCard;
