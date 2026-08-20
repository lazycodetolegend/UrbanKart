import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import StarRating from '../ui/StarRating';
import { useCart } from '../../context/CartContext';

import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;
    
  const isWishlisted = isInWishlist(product._id);

  return (
    <Link to={`/products/${product._id}`} className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          {discountPercent}% OFF
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        className={`absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        onClick={handleWishlist}
      >
        {isWishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
      </button>

      {/* Image Container */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-200">
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Quick Add Button overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-navy-900 hover:bg-orange-500 hover:text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">{product.category?.name || product.category}</span>
        
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="mb-2">
            <StarRating rating={product.avgRating} numReviews={product.reviews?.length || product.numReviews || 0} size="sm" />
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-navy-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
