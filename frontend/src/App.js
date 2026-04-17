import React, { useState, useEffect } from 'react';
import { authAPI, dishAPI, orderAPI } from './services/api';

// Components
import FoodTypeIndicator from './components/FoodTypeIndicator';
import DishCard from './components/DishCard';
import CustomerHeader from './components/CustomerHeader';
import SellerHeader from './components/SellerHeader';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import DishDetailPage from './pages/DishDetailPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerSignupPage from './pages/SellerSignupPage';
import SellerDashboard from './pages/SellerDashboard';
import AddDishPage from './pages/AddDishPage';
import CheckoutPage from './pages/CheckoutPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import SellerAboutPage from './pages/SellerAboutPage';

// Note: AddReviewPage is inside CustomerOrdersPage.js
// We must extract it so it works smoothly. Actually, to keep it simple, let's redefine AddReviewPage right here 
// OR import it from CustomerOrdersPage if exported. Let's just redefine AddReviewPage since it's a sub-flow.
// Wait, no, we can update CustomerOrdersPage.js later to export AddReviewPage. Let's assume it's exported.
import { AddReviewPage } from './pages/CustomerOrdersPage';

// ------------------------------------------------------------------
// --- MAIN APP COMPONENT ---
// ------------------------------------------------------------------

function App() {
    // --- STATE ---
    const [currentPage, setCurrentPage] = useState('home');
    const [cart, setCart] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentUser, setCurrentUser] = useState(null);
    const [notification, setNotification] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [orderToReview, setOrderToReview] = useState(null);

    // --- GLOBAL DATA FETCHING ---
    const fetchDishes = async () => {
        try {
            setIsLoading(true);
            const response = await dishAPI.getAllDishes();
            setDishes(response.data);
        } catch (error) {
            console.error("Error fetching dishes:", error);
            showNotification('Error: Could not load dishes.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- AUTHENTICATION ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
        }
        fetchDishes();
    }, []);

    const handleLoginSuccess = (user, token) => {
        const userWithType = { ...user, userType: user.businessName ? 'seller' : 'customer' };
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userWithType));
        setCurrentUser(userWithType);
        
        if (userWithType.userType === 'seller') {
            setCurrentPage('sellerDashboard');
        } else {
            setCurrentPage('home');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setCurrentPage('home');
        setMobileMenuOpen(false);
        showNotification('Logged out successfully');
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const addToCart = (dish, quantity = 1, instructions = '') => {
        const cartItemId = `${dish._id}-${Date.now()}`; 
        const existingItem = cart.find(item => item._id === dish._id && item.instructions === instructions);

        if (existingItem) {
            setCart(cart.map(item =>
                item._id === dish._id && item.instructions === instructions ? { ...item, quantity: item.quantity + quantity } : item
            ));
        } else {
            setCart([...cart, { ...dish, cartItemId: cartItemId, quantity, instructions }]);
        }
        showNotification(`Added ${dish.name} to cart!`);
        setCurrentPage('menu');
    };

    const removeFromCart = (cartItemId) => {
        setCart(cart.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, change) => {
        const item = cart.find(item => item.cartItemId === cartItemId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                removeFromCart(cartItemId);
            } else {
                setCart(cart.map(item =>
                    item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
                ));
            }
        }
    };
    
    const handlePlaceOrder = () => {
        setCart([]);
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const handleViewDetails = (dish) => {
        setSelectedDishId(dish._id);
        setCurrentPage('dishDetail');
    };
    
    const handleDishAdded = () => {
        showNotification('Dish added successfully!');
        fetchDishes();
        setCurrentPage('sellerDashboard');
    };
    
    const handleReviewOrder = (order) => {
        setOrderToReview(order);
        setCurrentPage('addReview');
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const filteredDishes = dishes.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || dish.type === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const selectedDish = dishes.find(d => d._id === selectedDishId);

    return (
        <div className="min-h-screen bg-gray-100">
            {notification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg z-[60] animate-slideIn text-sm md:text-base">
                    {notification}
                </div>
            )}

            {currentUser?.userType === 'seller' ? (
                <SellerHeader
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    mobileMenuOpen={mobileMenuOpen}
                    onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
            ) : (
                <CustomerHeader
                    currentUser={currentUser}
                    cartCount={cartCount}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    mobileMenuOpen={mobileMenuOpen}
                    onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
            )}

            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} dishes={dishes} cart={cart} onViewDetails={handleViewDetails} />}
            {currentPage === 'menu' && <MenuPage filteredDishes={filteredDishes} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} onViewDetails={handleViewDetails} isLoading={isLoading} />}
            {currentPage === 'cart' && <CartPage cart={cart} cartTotal={cartTotal} onUpdateQuantity={updateQuantity} onRemoveFromCart={removeFromCart} onNavigate={handleNavigate} />}
            {currentPage === 'customerLogin' && <CustomerLoginPage onLoginSuccess={handleLoginSuccess} onShowNotification={showNotification} />}
            {currentPage === 'sellerLogin' && <SellerLoginPage onLoginSuccess={handleLoginSuccess} onShowNotification={showNotification} onNavigate={handleNavigate} />}
            {currentPage === 'sellerSignup' && <SellerSignupPage onShowNotification={showNotification} onNavigate={handleNavigate} />}
            {currentPage === 'sellerDashboard' && <SellerDashboard currentUser={currentUser} onNavigate={handleNavigate} onShowNotification={showNotification} />}
            {currentPage === 'addDish' && <AddDishPage onDishAdded={handleDishAdded} onShowNotification={showNotification} />}
            {currentPage === 'sellerOrders' && <SellerOrdersPage onShowNotification={showNotification} />}
            {currentPage === 'sellerAbout' && <SellerAboutPage currentUser={currentUser} onShowNotification={showNotification} />}
            {currentPage === 'checkout' && <CheckoutPage cart={cart} cartTotal={cartTotal} onPlaceOrder={handlePlaceOrder} onShowNotification={showNotification} onNavigate={handleNavigate} />}
            {currentPage === 'customerOrders' && <CustomerOrdersPage onShowNotification={showNotification} onReviewOrder={handleReviewOrder} />}
            {currentPage === 'addReview' && <AddReviewPage order={orderToReview} onBack={() => handleNavigate('customerOrders')} onShowNotification={showNotification} />}
            {currentPage === 'dishDetail' && <DishDetailPage dish={selectedDish} onAddToCart={addToCart} onBack={() => handleNavigate('menu')} />}

            <Footer />

            {currentUser && Chatbot && <Chatbot />}

            <style>{`
                @keyframes slideIn {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
                .animate-slideIn {
                  animation: slideIn 0.3s ease;
                }
            `}</style>
        </div>
    );
}

export default App;