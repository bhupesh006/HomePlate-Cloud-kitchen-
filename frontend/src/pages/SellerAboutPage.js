import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot, Edit2, Mail, MessageSquareOff } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';


// --- COMPONENT: SellerAboutPage (With Logo Upload & Real Reviews) ---
const SellerAboutPage = ({ currentUser, onShowNotification }) => {
    
    const [logoFile, setLogoFile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayLogo, setDisplayLogo] = useState(currentUser?.logoUrl);
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        businessName: currentUser?.businessName || '',
        email: currentUser?.email || '',
        description: currentUser?.description || 'Authentic Indian cuisine with modern twist.',
        hours: currentUser?.hours || '9:00 AM - 11:00 PM'
    });

    useEffect(() => {
        setDisplayLogo(currentUser?.logoUrl);
    }, [currentUser]);

    // Fetch seller reviews
    useEffect(() => {
        if (currentUser?.id) {
            const fetchReviews = async () => {
                setIsLoading(true);
                try {
                    const response = await reviewAPI.getSellerReviews(currentUser.id);
                    setReviews(response.data);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReviews();
        }
    }, [currentUser]);

    const handleLogoFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await sellerAPI.updateProfile(profileData);
            
            // Sync with local storage
            if (localStorage.getItem('currentUser')) {
                const lsUser = JSON.parse(localStorage.getItem('currentUser'));
                const updatedUser = { ...lsUser, ...response.data.seller };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            
            setIsEditing(false);
            onShowNotification("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            onShowNotification("Failed to update profile.");
        }
    };

    const handleDirectLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logoFile', file);

        try {
            const response = await sellerAPI.updateLogo(formData);
            const newLogoUrl = response.data.seller.logoUrl;
            
            setDisplayLogo(newLogoUrl);
            
            if (localStorage.getItem('currentUser')) {
                const lsUser = JSON.parse(localStorage.getItem('currentUser'));
                lsUser.logoUrl = newLogoUrl;
                localStorage.setItem('currentUser', JSON.stringify(lsUser));
            }

            onShowNotification("Logo updated successfully!");
        } catch (error) {
            console.error("Error uploading logo:", error);
            onShowNotification("Failed to upload logo.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container w-full max-w-5xl mx-auto px-4 md:px-6">
                
                {/* Page Header */}
                <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Restaurant Profile</h2>
                    <p className="text-gray-500 mt-2 font-medium">Manage your kitchen's public details and see what customers are saying.</p>
                </div>
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="bg-gray-900 px-8 py-5 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Bot className="w-5 h-5 text-orange-500" /> About Our Restaurant
                        </h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-sm bg-gray-800 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 border border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-600 focus:outline-none">
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                        )}
                    </div>
                    
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            {/* Logo Display */}
                            <div className="relative w-40 h-40 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-500 overflow-hidden group border border-gray-200 shadow-inner flex-shrink-0">
                                {displayLogo ? (
                                    <>
                                        <img src={displayLogo} alt="Logo" className="w-full h-full object-cover" />
                                        <label className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                                            <Edit2 className="w-8 h-8 text-white mb-2" />
                                            <span className="text-white text-xs font-bold uppercase tracking-wider">Change Logo</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleDirectLogoUpload} />
                                        </label>
                                    </>
                                ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition text-orange-500">
                                        <Plus className="w-10 h-10 mb-2" />
                                        <span className="font-bold text-sm">Upload Logo</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleDirectLogoUpload} />
                                    </label>
                                )}
                            </div>
                            
                            {/* Details / Form */}
                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                                            <input type="text" className="w-full border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 p-3 rounded-xl transition font-semibold text-gray-900 outline-none" value={profileData.businessName} onChange={(e) => setProfileData({...profileData, businessName: e.target.value})} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email <Mail className="inline w-4 h-4 ml-1 text-gray-400" /></label>
                                            <input type="email" className="w-full border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 p-3 rounded-xl transition font-semibold text-gray-900 outline-none" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Operating Hours <Clock className="inline w-4 h-4 ml-1 text-gray-400" /></label>
                                            <input type="text" className="w-full border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 p-3 rounded-xl transition font-semibold text-gray-900 outline-none" value={profileData.hours} onChange={(e) => setProfileData({...profileData, hours: e.target.value})} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Restaurant Description</label>
                                            <textarea className="w-full border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 p-4 rounded-xl transition font-medium text-gray-800 outline-none min-h-[120px] resize-none" value={profileData.description} onChange={(e) => setProfileData({...profileData, description: e.target.value})} />
                                        </div>
                                        <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-200 mt-2">
                                            <button type="submit" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition shadow-md hover:shadow-lg focus:ring-4 focus:ring-orange-500/30 outline-none">Save Changes</button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border border-gray-300 text-gray-800 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition focus:ring-4 focus:ring-gray-200 outline-none shadow-sm">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6 pt-2">
                                        <div>
                                            <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{profileData.businessName}</h4>
                                            <p className="inline-flex mt-2 items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                                Cloud Kitchen Partner
                                            </p>
                                        </div>
                                        
                                        <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">{profileData.description}</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="flex items-center gap-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition p-4 rounded-2xl">
                                                <div className="bg-orange-50 p-3 rounded-xl">
                                                    <Mail className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Email</p>
                                                    <p className="font-semibold text-gray-900 truncate">{profileData.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition p-4 rounded-2xl">
                                                <div className="bg-orange-50 p-3 rounded-xl">
                                                    <Clock className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Operating Hours</p>
                                                    <p className="font-semibold text-gray-900 truncate">{profileData.hours}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <Star className="w-6 h-6 text-yellow-500 fill-current" /> 
                            Customer Reviews 
                            <span className="bg-gray-900 text-white text-xs font-bold py-1 px-2.5 rounded-full ml-2 shadow-sm">{reviews.length}</span>
                        </h3>
                    </div>
                    
                    <div className="p-8">
                        {isLoading ? (
                            <div className="animate-pulse space-y-6">
                                {[1,2].map(n => (
                                    <div key={n} className="flex space-x-4 border border-gray-100 p-6 rounded-2xl">
                                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                        <div className="flex-1 space-y-4 py-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                    <MessageSquareOff className="w-10 h-10 text-gray-400" />
                                </div>
                                <h4 className="text-xl font-extrabold text-gray-900 mb-2">No reviews yet</h4>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Keep cooking up a storm! Your customer feedback will appear here once you start receiving orders.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map(review => (
                                    <div key={review._id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition group">
                                        <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-extrabold text-lg ring-4 ring-white shadow-sm">
                                                    {(review.customerId?.name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900">{review.customerId?.name || 'Customer'}</p>
                                                    <p className="text-xs text-gray-500 font-medium tracking-wide">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 text-yellow-400 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed font-medium">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAboutPage;
