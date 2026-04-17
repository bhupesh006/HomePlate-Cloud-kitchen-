import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot, Utensils, UtensilsCrossed } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: SellerDashboard ---
const SellerDashboard = ({ currentUser, onNavigate, onShowNotification }) => {
    
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalDishes: 0,
        avgRating: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    sellerAPI.getSellerStats(),
                    orderAPI.getSellerOrders()
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                onShowNotification("Could not load dashboard data.");
            }
        };
        fetchDashboardData();
    }, [onShowNotification]);

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="w-full mx-auto px-4 md:px-8 pt-8">
                {/* Hero Banner */}
                <div className="bg-gray-900 rounded-3xl shadow-2xl mb-10 relative overflow-hidden">
                    {/* Background Pattern Masked to Right Side */}
                    <div 
                        className="absolute inset-y-0 right-0 w-full md:w-2/3 bg-cover bg-center opacity-70"
                        style={{ backgroundImage: "url('/images/food-pattern.png')" }}
                    >
                        {/* Gradient mask to fade in from the solid left side */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Seller Dashboard</h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium">
                            Welcome back, <span className="text-orange-400 font-bold">{currentUser?.name}</span>
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">Total Orders</p>
                            <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalOrders}</h3>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                            <Package className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">Revenue</p>
                            <h3 className="text-3xl font-extrabold text-gray-900">₹{stats.totalRevenue}</h3>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                            <DollarSign className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">Menu Items</p>
                            <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalDishes}</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                            <Utensils className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">Avg Rating</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-3xl font-extrabold text-gray-900">{stats.avgRating}</h3>
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                            <MessageCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Table & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                            <button onClick={() => onNavigate('sellerOrders')} className="text-sm text-orange-500 hover:text-orange-600 font-semibold group flex items-center gap-1 transition">
                                View All <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-1 transition" />
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="pb-4 px-4 font-semibold text-gray-400 text-xs tracking-widest uppercase">Order ID</th>
                                        <th className="pb-4 px-4 font-semibold text-gray-400 text-xs tracking-widest uppercase">Customer</th>
                                        <th className="pb-4 px-4 font-semibold text-gray-400 text-xs tracking-widest uppercase">Items</th>
                                        <th className="pb-4 px-4 font-semibold text-gray-400 text-xs tracking-widest uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, i) => (
                                        <tr key={order._id} className={`group transition ${i !== recentOrders.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                            <td className="py-5 px-4 font-bold text-gray-700">#{order._id.slice(-6)}</td>
                                            <td className="py-5 px-4 font-medium text-gray-900">{order.customerId?.name || 'Customer'}</td>
                                            <td className="py-5 px-4 text-gray-500 truncate max-w-[200px]" title={order.items.map(i => i.name).join(', ')}>
                                                {order.items.map(dish => dish.name).join(', ')}
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                 <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-400 font-medium">No recent orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="space-y-5">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={() => onNavigate('addDish')}
                                    className="w-full group bg-orange-500 text-white p-5 rounded-2xl shadow-md hover:bg-orange-600 hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-xl">
                                            <Plus size={24} className="text-white transform group-hover:scale-110 transition" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-lg">Add New Dish</h4>
                                            <p className="text-orange-100 text-sm font-medium pt-1">Expand your menu</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="w-5 h-5 opacity-50 rotate-180 transform group-hover:opacity-100 group-hover:translate-x-1 transition" />
                                </button>

                                <button
                                    onClick={() => onNavigate('sellerOrders')}
                                    className="w-full group bg-gray-800 text-white p-5 rounded-2xl shadow-md hover:bg-gray-900 hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-3 rounded-xl border border-gray-700">
                                            <Package size={24} className="text-gray-300 transform group-hover:scale-110 transition" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-lg">Manage Orders</h4>
                                            <p className="text-gray-400 text-sm font-medium pt-1">View entire history</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="w-5 h-5 opacity-50 rotate-180 transform group-hover:opacity-100 group-hover:translate-x-1 transition" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
