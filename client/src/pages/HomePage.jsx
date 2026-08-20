import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaExchangeAlt, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';

const getCategoryIcon = (category) => {
  const icons = {
    'Electronics': '📱',
    'Fashion': '👕',
    'Home & Kitchen': '🍳',
    'Books': '📚',
    'Beauty': '💄',
  };
  return icons[category] || '🛍️';
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, categoriesRes, newArrivalsRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
          api.get('/products?sort=-createdAt&limit=4')
        ]);

        if (featuredRes.data.success) setFeaturedProducts(featuredRes.data.products);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.categories.slice(0, 5));
        if (newArrivalsRes.data.success) setNewArrivals(newArrivalsRes.data.products);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-900 text-white pt-24 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 animate-gradient-x"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 font-semibold text-sm mb-6 border border-orange-500/30">
            Big Summer Sale is Live!
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Discover the Best of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              UrbanKart
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            Shop the latest trends, hottest gadgets, and everyday essentials with premium quality and unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Shopping <FaArrowRight />
            </Link>
            <Link to="/products?sort=-createdAt" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 mt-[-40px] relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/products?category=${cat.name}`}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-3xl group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Handpicked for you with the best quality.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link to="/products" className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 bg-orange-50 px-6 py-2 rounded-lg">
              View All Products <FaArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute left-1/4 bottom-0 w-32 h-32 bg-black opacity-10 rounded-full translate-y-1/2"></div>
            
            <div className="relative z-10 md:w-1/2 text-white text-center md:text-left mb-8 md:mb-0">
              <span className="uppercase font-bold tracking-wider text-orange-100 mb-2 block">Special Offer</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Get up to 50% off on Electronics</h2>
              <p className="text-orange-50 mb-6 text-lg">Upgrade your tech game with our premium selection of smartphones, laptops, and accessories.</p>
              <Link to="/products?category=Electronics" className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg inline-block transition-colors shadow-lg">
                Shop Electronics
              </Link>
            </div>
            <div className="relative z-10 md:w-1/3 flex justify-center">
              <div className="text-[120px]">🎧</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">New Arrivals</h2>
              <p className="text-gray-500 mt-2">Check out the latest additions to our store.</p>
            </div>
            <Link to="/products?sort=-createdAt" className="hidden sm:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Shop with Us */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-10 bg-white py-16 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Why Shop With Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center px-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <FaShippingFast className="text-4xl text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Free Delivery</h3>
            <p className="text-gray-500">On all orders over ₹500</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <FaShieldAlt className="text-4xl text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Secure Payment</h3>
            <p className="text-gray-500">100% secure payment gateways</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <FaExchangeAlt className="text-4xl text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Easy Returns</h3>
            <p className="text-gray-500">10-day hassle free return policy</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <FaHeadset className="text-4xl text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">24/7 Support</h3>
            <p className="text-gray-500">Dedicated customer support team</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
