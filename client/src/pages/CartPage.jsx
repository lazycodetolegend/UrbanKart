import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
  const { cartItems, cartTotal, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  const shippingCost = cartTotal > 500 ? 0 : 40;
  const finalTotal = cartTotal + (cartItems.length > 0 ? shippingCost : 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-6xl text-gray-300">
          🛒
        </div>
        <h2 className="text-3xl font-bold text-navy-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our top products and start shopping!
        </p>
        <Link to="/products" className="btn-primary flex items-center gap-2 px-8 py-3 text-lg">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex gap-4 w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-orange-600 line-clamp-2 mb-1">
                        {item.name}
                      </Link>
                      <span className="text-sm text-gray-500 mb-2">Category: {item.category?.name || item.category}</span>
                      {/* Mobile Only Price & Actions */}
                      <div className="sm:hidden flex items-center justify-between mt-auto">
                        <span className="font-bold text-navy-900">{formatPrice(item.price)}</span>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:flex col-span-2 items-center justify-center font-semibold text-gray-800">
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center w-full sm:w-auto">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        disabled={item.qty <= 1}
                      >-</button>
                      <span className="w-10 text-center font-medium text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        disabled={item.qty >= item.stock}
                      >+</button>
                    </div>
                  </div>

                  {/* Subtotal & Remove (Desktop) */}
                  <div className="hidden sm:flex col-span-2 items-center justify-end gap-4">
                    <span className="font-bold text-orange-600">{formatPrice(item.price * item.qty)}</span>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={clearCart}
                className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <FaTrash size={12} /> Clear Cart
              </button>
              <Link to="/products" className="text-navy-900 font-semibold hover:text-orange-600 text-sm">
                Continue Shopping &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-medium text-green-600">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              
              {shippingCost > 0 && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded text-center">
                  Add {formatPrice(500 - cartTotal)} more to get FREE shipping!
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-navy-900">Total:</span>
                <span className="text-2xl font-extrabold text-orange-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button 
              className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 mb-4"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout <FaArrowRight />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FaShieldAlt className="text-green-500" />
              <span>Secure checkout with 128-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
