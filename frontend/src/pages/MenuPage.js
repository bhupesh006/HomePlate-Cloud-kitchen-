import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';
import DishCard from '../components/DishCard';

// --- COMPONENT: MenuPage ---
const MenuPage = ({ filteredDishes, categoryFilter, onCategoryChange, onViewDetails, isLoading }) => (
    <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 underline">Our Menu</h2>
                    <p className="text-gray-600 mt-2">All Available Dishes</p>
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full md:w-auto"
                >
                    <option value="all">All Categories</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                </select>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-gray-600 text-lg">Loading dishes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes.map(dish => (
                        <DishCard key={dish._id} dish={dish} onViewDetails={onViewDetails} />
                    ))}
                </div>
            )}
        </div>
    </div>
);

export default MenuPage;
