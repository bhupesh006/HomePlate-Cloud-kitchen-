import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: SellerOrdersPage ---
const SellerOrdersPage = ({ onShowNotification }) => {
    
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSellerOrders = async () => {
        setIsLoading(true);
        try {
            const response = await orderAPI.getSellerOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching seller orders:", error);
            onShowNotification("Could not load orders.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSellerOrders();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderAPI.updateOrderStatus(orderId, newStatus);
            onShowNotification(`Order ${orderId.slice(-6)} updated to ${newStatus}`);
            fetchSellerOrders();
        } catch (error) {
            console.error("Error updating status:", error);
            onShowNotification("Error: Could not update status.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6">All Orders</h2>
                {isLoading ? (
                    <div className="text-center py-12">Loading orders...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-orange-500 text-white">
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left">Items</th>
                                    <th className="px-4 py-3 text-left">Instructions</th>
                                    <th className="px-4 py-3 text-left">Amount</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{order._id.slice(-6)}</td>
                                        <td className="px-4 py-3">
                                            {order.customerId?.name || 'N/A'}<br />
                                            <small className="text-gray-500">{order.customerId?.phone || 'N/A'}</small>
                                        </td>
                                        <td className="px-4 py-3">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                                        <td className="px-4 py-3">
                                            {order.specialInstructions
                                                ? <span className='text-red-600 italic font-medium'>{order.specialInstructions}</span>
                                                : <span className='text-gray-500'>None</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 font-semibold">₹{order.totalAmount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`font-bold ${order.status === 'delivered' ? 'text-green-500' :
                                                order.status === 'preparing' ? 'text-orange-500' :
                                                    'text-blue-500'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.status === 'new' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrdersPage;
