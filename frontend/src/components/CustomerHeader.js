import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: CustomerHeader ---
const CustomerHeader = ({ cartCount, currentUser, onNavigate, onLogout, searchTerm, onSearchChange, mobileMenuOpen, onToggleMobileMenu }) => (
    <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="w-full mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
                <h1
                    className="text-xl md:text-2xl font-bold cursor-pointer hover:text-orange-400 transition"
                    onClick={() => onNavigate('home')}
                >
                    Home Plate
                </h1>
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
                    <div className="relative w-full md:w-auto mb-4 md:mb-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onFocus={() => onNavigate('menu')}
                            className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => onNavigate('home')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => onNavigate('menu')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => onNavigate('customerOrders')}
                        className="hover:text-orange-400 transition w-full md:w-auto text-left md:text-center"
                    >
                        My Orders
                    </button>
                    {!currentUser && (
                        <button
                            onClick={() => onNavigate('sellerSignup')}
                            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition text-sm w-full md:w-auto"
                        >
                            Become Seller
                        </button>
                    )}
                    <button
                        onClick={() => onNavigate('cart')}
                        className="relative hover:text-orange-400 transition"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    {currentUser && currentUser.userType === 'customer' ? (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-sm">{currentUser.name}</span>
                            <button
                                onClick={onLogout}
                                className="hover:text-orange-400"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate('customerLogin')}
                            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition w-full md:w-auto"
                        >
                            Login
                        </button>
                    )}
                </nav>
            </div>
        </div>
    </header>
);

export default CustomerHeader;
