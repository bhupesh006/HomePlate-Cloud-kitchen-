import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: CustomerOrdersPage (With Review Button) ---
const CustomerOrdersPage = ({ onShowNotification, onReviewOrder }) => {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            setIsLoading(true);
            try {
                const response = await orderAPI.getCustomerOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching customer orders:", error);
                onShowNotification("Could not load your orders.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomerOrders();
    }, [onShowNotification]);

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6">Your Order History</h2>
                {isLoading ? (
                    <div className="text-center py-12">Loading your orders...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className='p-4 border border-gray-200 rounded-lg'>
                                <div className='flex justify-between items-center border-b pb-2 mb-2'>
                                    <span className='font-bold text-lg'>Order #{order._id.slice(-6)}</span>
                                    <span className={`font-bold text-sm p-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <p className='text-gray-700'>{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                                <p className='text-gray-900 font-semibold'>Total: ₹{order.totalAmount}</p>
                                {order.specialInstructions && <p className='text-xs italic text-gray-500'>Instructions: {order.specialInstructions}</p>}
                                
                                {order.status === 'delivered' && (
                                    <button 
                                        onClick={() => onReviewOrder(order)} // Pass the full order
                                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <p className='text-center text-gray-500 py-8'>You haven't placed any orders yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- NEW COMPONENT: AddReviewPage ---
const AddReviewPage = ({ order, onBack, onShowNotification }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        try {
            await reviewAPI.createReview({ 
                orderId: order._id, 
                sellerId: order.sellerId,
                rating, 
                comment 
            });
            onShowNotification('Review submitted! Thank you.');
            onBack(); // Go back to the orders page
        } catch (error) {
            console.error("Error submitting review:", error);
            onShowNotification(error.response?.data?.error || "Failed to submit review.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6 max-w-lg">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Write a Review</h2>
                    <p className="text-gray-600 mb-4">Reviewing order #{order._id.slice(-6)}</p>
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Rating (1-5)</label>
                            <select 
                                value={rating} 
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value={5}>5 Stars (Excellent)</option>
                                <option value={4}>4 Stars (Good)</option>
                                <option value={3}>3 Stars (Average)</option>
                                <option value={2}>2 Stars (Poor)</option>
                                <option value={1}>1 Star (Bad)</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                rows="4"
                                placeholder="Tell us about your experience..."
                            />
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                            Submit Review
                        </button>
                        <button type="button" onClick={onBack} className="w-full mt-2 text-center text-gray-600 hover:text-black">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrdersPage;
export { AddReviewPage };
