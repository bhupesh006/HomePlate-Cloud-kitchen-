import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot, Flame, Utensils, ClipboardList } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';
import DishCard from '../components/DishCard';

// --- COMPONENT: HomePage (With Hero Image) ---
const HomePage = ({ onNavigate, dishes, onViewDetails, cart }) => {
    
    const [aiSuggestions, setAiSuggestions] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const cartItems = cart.map(item => ({ 
                    dishId: item._id, 
                    type: item.type, 
                    category: item.category 
                }));
                // Only fetch if logged in
                const token = localStorage.getItem('authToken');
                if (token) {
                    const response = await recommendationAPI.getRecommendations(cartItems);
                    setAiSuggestions(response.data);
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
        fetchRecommendations();
    }, [cart]);

    return (
        <div>
            {/* --- THIS SECTION IS UPDATED (REQUEST #6) --- */}
            <section 
                className="relative text-white py-12 md:py-20 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg)' }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
                
                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Delicious Food Delivered</h1>
                    <p className="text-lg md:text-xl mb-8">Order from the best restaurants and cloud kitchens in your area</p>
                    <button 
                        onClick={() => onNavigate('menu')}
                        className="bg-orange-500 text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105"
                    >
                        Order Now
                    </button>
                </div>
            </section>
            {/* --- END OF UPDATED SECTION --- */}

            {aiSuggestions.length > 0 && (
                <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Curated For You</h2>
                            <p className="text-gray-500 font-medium">Handpicked dishes inspired by your tastes and local favorites</p>
                        </div>
                        
                        {aiSuggestions.map((suggestion, idx) => {
                            // Strip any emojis returned from cached backend responses
                            const cleanReason = suggestion.reason.replace(/[^\x20-\x7E]/g, '').trim();
                            
                            let IconComponent = Star;
                            let iconColor = "text-yellow-500 fill-current";
                            if (cleanReason.includes("pairing")) { IconComponent = Utensils; iconColor = "text-orange-500"; }
                            else if (cleanReason.includes("Top rated")) { IconComponent = Star; iconColor = "text-yellow-500 fill-current"; }
                            else if (cleanReason.includes("You might also like")) { IconComponent = Flame; iconColor = "text-orange-500 fill-current"; }
                            else if (cleanReason.includes("order history")) { IconComponent = ClipboardList; iconColor = "text-gray-500"; }

                            return (
                                <div key={idx} className="mb-12">
                                    <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray-800 mb-6">
                                        <div className="bg-white p-2 shadow-sm rounded-lg border border-gray-100">
                                            <IconComponent className={`w-5 h-5 ${iconColor}`} />
                                        </div>
                                        {cleanReason}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {suggestion.dishes.map(dish => (
                                            <DishCard key={dish._id} dish={dish} onViewDetails={onViewDetails} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="bg-gray-100 py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 underline">Featured Dishes</h2>
                            <p className="text-gray-600 mt-2">Top picks from our menu</p>
                        </div>
                        <button
                            onClick={() => onNavigate('menu')}
                            className="text-orange-500 border border-orange-500 px-4 md:px-6 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
                        >
                            See All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dishes.slice(0, 3).map(dish => (
                            <DishCard key={dish._id} dish={dish} onViewDetails={onViewDetails} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
