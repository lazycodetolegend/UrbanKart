import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}&category=${category}`);
    }
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Beauty'];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Bar */}
      <div className="bg-navy-900 text-white py-3 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white hover:text-orange-500 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:opacity-90">
            Urban<span className="text-orange-500">Kart</span>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-3xl items-center mx-6">
          <form onSubmit={handleSearch} className="flex w-full rounded-md overflow-hidden bg-white">
            <select 
              className="bg-gray-100 text-gray-700 px-3 py-2 outline-none border-r border-gray-300 text-sm focus:bg-gray-200 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Search UrbanKart" 
              className="flex-1 px-4 py-2 text-black outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-5 text-white transition-colors">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* User Menu */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 hover:text-orange-500 transition p-2">
              <FaUser className="text-xl hidden sm:block" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-300">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
                <span className="font-bold text-sm hidden sm:block">Account & Lists</span>
              </div>
            </div>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white text-black shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 z-50 py-2">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600">Your Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600">Your Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 text-red-600 mt-1 border-t border-gray-100">Sign Out</button>
                </>
              ) : (
                <div className="p-4 text-center">
                  <Link to="/login" className="btn-primary block w-full mb-2 py-1.5 text-sm">Sign In</Link>
                  <p className="text-xs">New customer? <Link to="/register" className="text-orange-500 hover:underline">Start here.</Link></p>
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-1 hover:text-orange-500 transition relative p-2">
            <div className="relative">
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </div>
            <span className="font-bold text-sm hidden sm:block mt-2">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-navy-800 p-3">
        <form onSubmit={handleSearch} className="flex w-full rounded-md overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-1 px-3 py-2 text-black outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-orange-500 px-4 text-white">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-navy-700 text-white text-sm">
        <nav className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} overflow-x-auto whitespace-nowrap px-4 py-2`}>
          <ul className="flex flex-col md:flex-row gap-2 md:gap-6">
            {categories.map((cat) => (
              <li key={cat}>
                <Link 
                  to={`/products?category=${cat}`} 
                  className="block py-2 md:py-1 px-2 hover:border-white border border-transparent rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
