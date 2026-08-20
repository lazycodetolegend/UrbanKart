import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you like and they will show up here.</p>
          <Link to="/products" className="btn-primary px-8 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
