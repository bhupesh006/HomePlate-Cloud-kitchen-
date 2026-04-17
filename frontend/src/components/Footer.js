import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


import { Phone, Mail } from 'lucide-react';

// --- COMPONENT: Footer ---
const Footer = () => (
    <footer className="bg-orange-500 text-white py-12 mt-12">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold">Home</h2>
                    <h2 className="text-3xl font-bold">Plate</h2>
                </div>
                <div className="text-center md:text-right">
                    <h3 className="text-xl font-bold mb-4">Contact and support</h3>
                    <p className="flex items-center justify-center md:justify-end gap-2 mb-2">
                        <Phone size={18} className="text-white" /> +91 9876543210
                    </p>
                    <p className="flex items-center justify-center md:justify-end gap-2">
                        <Mail size={18} className="text-white" /> support@homeplate.com
                    </p>
                </div>
            </div>
        </div>
    </footer>
);


// ------------------------------------------------------------------
export default Footer;
