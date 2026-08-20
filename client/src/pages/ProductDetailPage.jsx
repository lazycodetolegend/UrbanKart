import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="text-orange-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 flex gap-2">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category?.name || product.category}`} className="hover:text-orange-600">{product.category?.name || product.category}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        {/* Left: Images */}
        <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 flex-shrink-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${activeImage === idx ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-gray-50" />
                </button>
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden relative aspect-square">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300 font-bold">
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white font-bold px-3 py-1.5 rounded-md shadow-md">
                {discountPercent}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <StarRating rating={product.avgRating} numReviews={product.reviews?.length || 0} size="md" />
              <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-500">Brand: <span className="font-semibold text-navy-900">{product.brand || 'UrbanKart'}</span></span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-orange-600">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description?.substring(0, 150)}...
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {product.stock > 0 ? (
                <div className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm w-fit">
                  <FaCheckCircle /> In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full text-sm w-fit">
                  <FaExclamationCircle /> Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-auto">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden h-12">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                disabled={product.stock === 0}
              >-</button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-12 h-full text-center border-x border-gray-300 focus:outline-none appearance-none font-medium"
                disabled={product.stock === 0}
              />
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                disabled={product.stock === 0}
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                product.stock > 0 
                  ? 'bg-navy-900 text-white hover:bg-navy-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button className="h-12 w-12 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
              <FaRegHeart size={20} />
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold text-gray-800">Category:</span>
              <Link to={`/products?category=${product.category?.name || product.category}`} className="hover:text-orange-600">{product.category?.name || product.category}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('description')}
            className={`flex-1 md:flex-none px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'description' ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 md:flex-none px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          {activeTab === 'description' ? (
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
              <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3 bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="text-5xl font-bold text-navy-900 mb-2">{product.avgRating?.toFixed(1) || '0.0'}</div>
                  <StarRating rating={product.avgRating} size="lg" />
                  <p className="text-sm text-gray-500 mt-2">Based on {product.reviews?.length || 0} reviews</p>
                </div>
                
                <div className="md:w-2/3">
                  {!user ? (
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-center justify-between">
                      <span>Please login to write a review.</span>
                      <Link to="/login" className="bg-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:shadow">Login</Link>
                    </div>
                  ) : (
                    <button className="btn-outline">Write a Review</button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.name}</p>
                          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
