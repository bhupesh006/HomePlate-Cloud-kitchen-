import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: AddDishPage (With File Upload) ---
const AddDishPage = ({ onDishAdded, onShowNotification }) => {
    
    const [imageFile, setImageFile] = useState(null);
    const [dishData, setDishData] = useState({
        name: '', price: '', type: '', description: '', category: '', prepTime: '',
    });

    const handleTextChange = (e) => {
        setDishData({ ...dishData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!imageFile) {
            onShowNotification("Please upload an image for the dish.");
            return;
        }

        const formData = new FormData();
        formData.append('name', dishData.name);
        formData.append('price', dishData.price);
        formData.append('type', dishData.type);
        formData.append('description', dishData.description);
        formData.append('category', dishData.category);
        formData.append('prepTime', dishData.prepTime);
        formData.append('imageFile', imageFile); // This key must match server.js
        
        try {
            await dishAPI.createDish(formData);
            onDishAdded(); // This calls fetchDishes() & navigates
        } catch (error) {
            console.error("Error creating dish:", error);
            onShowNotification("Error: Could not add dish.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">Add New Dish</h2>
                    <form onSubmit={handleSubmit}>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Dish Image *</label>
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="imageUpload"
                                    required
                                />
                                <label htmlFor="imageUpload" className="cursor-pointer block text-orange-500 font-semibold">
                                    {imageFile ? `File: ${imageFile.name}` : 'Click to Upload Image'}
                                </label>
                                <p className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Dish Name *</label>
                            <input type="text" name="name" value={dishData.name} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Description</label>
                            <textarea name="description" value={dishData.description} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows="3" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
                                <input type="number" name="price" value={dishData.price} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Type *</label>
                                <select name="type" value={dishData.type} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                                    <option value="">Select Type</option>
                                    <option value="veg">Vegetarian</option>
                                    <option value="non-veg">Non-Vegetarian</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                                <select name="category" value={dishData.category} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                                    <option value="">Select Category</option>
                                    <option value="appetizer">Appetizer</option>
                                    <option value="main-course">Main Course</option>
                                    <option value="dessert">Dessert</option>
                                    <option value="beverage">Beverage</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Prep Time (min) *</label>
                                <input type="number" name="prepTime" value={dishData.prepTime} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Add Dish
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDishPage;
