import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';
import FoodTypeIndicator from '../components/FoodTypeIndicator';

// --- COMPONENT: DishDetailPage ---
const DishDetailPage = ({ dish, onAddToCart, onBack }) => {
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');

    if (!dish) {
        return <div className='p-12 text-center text-red-500'>Dish not found!</div>;
    }

    const stars = '★'.repeat(Math.floor(dish.rating)) + '☆'.repeat(5 - Math.floor(dish.rating));

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden">
                <div className='p-4 md:p-6 border-b flex items-center gap-4'>
                    <button onClick={onBack} className='text-gray-600 hover:text-orange-500'>
                        <ArrowLeft className='w-6 h-6' />
                    </button>
                    <h1 className='text-2xl font-bold text-gray-800'>Order Details</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className='p-0'>
                        <img src={dish.image} alt={dish.name} className="w-full h-80 object-cover" />
                    </div>
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-3xl font-bold text-gray-800">{dish.name}</h2>
                            <FoodTypeIndicator type={dish.type} />
                        </div>
                        <p className="text-gray-700 mb-4 text-sm">{dish.description}</p>
                        <div className='flex items-center justify-between mb-4 border-b pb-4'>
                            <span className="text-3xl font-bold text-orange-600">₹{dish.price}</span>
                            <div className="flex items-center gap-2">
                                <Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
                                <span className="font-bold text-xl text-yellow-500">{dish.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className='space-y-3 mb-6 text-base text-gray-600'>
                            <p className='flex items-center gap-3'><MapPin className='w-5 h-5 text-orange-500' /> <strong>Kitchen:</strong> <span className='font-semibold text-gray-800'>{dish.sellerId?.businessName || 'Kitchen'}</span></p>
                            <p className='flex items-center gap-3'><Clock className='w-5 h-5 text-orange-500' /> <strong>Prep Time:</strong> {dish.prepTime} mins</p>
                        </div>
                        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                            <label htmlFor="custom-instructions" className="block text-gray-700 font-semibold mb-2">
                                Special Instructions (Customization)
                            </label>
                            <textarea
                                id="custom-instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                rows="2"
                                placeholder="e.g., Low sugar, extra spice, no onions..."
                            ></textarea>
                        </div>
                        <div className="sticky bottom-0 bg-white p-4 -mx-4 md:static md:p-0 flex items-center justify-between gap-4 border-t md:border-t-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="bg-gray-800 text-white w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-xl">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="bg-gray-800 text-white w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={() => onAddToCart(dish, quantity, instructions)}
                                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold text-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className='w-5 h-5' /> Add to Cart (₹{dish.price * quantity})
                            </button>
                        </div>
                    </div>
                </div>
                {/* Review section can be built out here later */}
            </div>
        </div>
    );
};

export default DishDetailPage;
