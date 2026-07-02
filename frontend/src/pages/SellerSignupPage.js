import React, { useState } from 'react';
import { Store, ShieldCheck, Landmark, Lock } from 'lucide-react';
import { authAPI } from '../services/api';


// --- COMPONENT: SellerSignupPage ---
const SellerSignupPage = ({ onShowNotification, onNavigate }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        fssaiNumber: '',
        aadhaarNumber: '',
        panNumber: '',
        bankAccountNo: '',
        ifscCode: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            onShowNotification('Passwords do not match.');
            return;
        }
        try {
            const response = await authAPI.sellerRegister(formData);
            onShowNotification(response.data.message || 'Seller account created! Please login.');
            onNavigate('sellerLogin');
        } catch (error) {
            const msg = error.response?.data?.error || 'Registration failed.';
            onShowNotification(msg);
        }
    };
    
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'aadhaarNumber' || name === 'bankAccountNo') {
            value = value.replace(/\D/g, ''); // restrict to digits only
        } else if (name === 'panNumber') {
            value = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // alphanumeric, capitalized
            if (value.length > 10) value = value.substring(0, 10);
        } else if (name === 'ifscCode') {
            value = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // alphanumeric, capitalized
            if (value.length > 11) value = value.substring(0, 11);
        }
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">Seller Registration</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Business Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <Store className="w-5 h-5 text-orange-500" /> Business Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Name *</label>
                                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username *</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">FSSAI License *</label>
                                    <input type="text" name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Address *</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows="2" required />
                            </div>
                        </div>

                        {/* Section 2: Verification Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-orange-500" /> Verification Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar/ID Proof Number * <span className="text-xs text-gray-400 font-normal">(only numbers)</span></label>
                                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Card <span className="text-xs text-orange-500 font-bold">(Recommended)</span></label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Bank Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <Landmark className="w-5 h-5 text-orange-500" /> Bank Account Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Account Number *</label>
                                    <input type="text" name="bankAccountNo" value={formData.bankAccountNo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code *</label>
                                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Security */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-orange-500" /> Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Create Seller Account
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('sellerLogin')}
                                className="text-orange-500 font-semibold hover:underline"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerSignupPage;
