import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: SellerHeader ---
const SellerHeader = ({ currentUser, onNavigate, onLogout, mobileMenuOpen, onToggleMobileMenu }) => (
    <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="w-full mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8">
                    <h1
                        className="text-xl md:text-2xl font-bold cursor-pointer hover:text-orange-400 transition"
                        onClick={() => onNavigate('sellerDashboard')}
                    >
                        Home Plate Seller
                    </h1>
                </div>
                <button
                    className="md:hidden text-white"
                    onClick={onToggleMobileMenu}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
                <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 right-0 bg-gray-800 md:bg-transparent flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-0 shadow-lg md:shadow-none`}>
                    <button
                        onClick={() => onNavigate('sellerDashboard')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => onNavigate('addDish')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Add Dishes
                    </button>
                    <button
                        onClick={() => onNavigate('sellerOrders')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => onNavigate('sellerAbout')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Profile
                    </button>
                    {currentUser && (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-sm">{currentUser.name}</span>
                            <button
                                onClick={onLogout}
                                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    </header>
);

export default SellerHeader;
