import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- 1. UI FIX: FoodTypeIndicator (Smaller, No Text) ---
const FoodTypeIndicator = ({ type }) => {
    const isVeg = type === 'veg';
    const bgColor = isVeg ? 'bg-green-500' : 'bg-red-500';
    const borderColor = isVeg ? 'border-green-500' : 'border-red-500';

    return (
        <div className="flex items-center">
            <div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 ${borderColor} p-0.5 shadow-sm bg-white`}>
                <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>
            </div>
        </div>
    );
};
// ------------------------------------------

// ------------------------------------------------------------------
// --- ALL COMPONENTS (Defined Outside App) ---
// ------------------------------------------------------------------

export default FoodTypeIndicator;
