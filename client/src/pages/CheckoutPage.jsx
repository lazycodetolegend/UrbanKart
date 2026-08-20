import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'India',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartTotal;
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const totalAmount = itemsPrice + shippingPrice;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [testOrderId, setTestOrderId] = useState('');

  const handlePayment = async (method) => {
    setLoading(true);
    try {
      if (method === 'Razorpay') {
        const { data: orderData } = await api.post('/payments/razorpay/order', { amount: totalAmount });
        
        if (orderData.isTestMode) {
          setTestOrderId(orderData.order_id || 'order_test_' + Date.now());
          setShowRazorpayModal(true);
          setLoading(false);
          return;
        }

        const razorpayKey = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: 'INR',
          name: 'UrbanKart',
          description: 'Order Payment',
          order_id: orderData.order_id,
          handler: async function (response) {
            try {
              const verifyRes = await api.post('/payments/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                createOrder('Razorpay', response.razorpay_payment_id);
              }
            } catch (err) {
              toast.error('Payment verification failed');
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: shippingAddress.phone
          },
          theme: { color: '#FF9900' }
        };

        if (window.Razorpay && razorpayKey && !orderData.isTestMode) {
          const rzp = new window.Razorpay(options);
          rzp.open();
          setLoading(false);
        } else {
          setTestOrderId(orderData.order_id || 'order_test_' + Date.now());
          setShowRazorpayModal(true);
          setLoading(false);
        }
      } else {
        await createOrder('COD');
      }
    } catch (err) {
      console.error(err);
      toast.error('Payment processing failed.');
      setLoading(false);
    }
  };

  const handleCompleteRazorpayTestPayment = async () => {
    setLoading(true);
    const mockPaymentId = 'pay_test_' + Date.now();
    try {
      await api.post('/payments/razorpay/verify', {
        razorpay_order_id: testOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: 'test_signature'
      });
      setShowRazorpayModal(false);
      await createOrder('Razorpay', mockPaymentId);
    } catch (err) {
      setShowRazorpayModal(false);
      await createOrder('Razorpay', mockPaymentId);
    }
  };

  const [completedOrder, setCompletedOrder] = useState(null);

  const createOrder = async (paymentMethod, paymentId = null) => {
    try {
      const orderData = {
        items: cartItems.map(item => ({ product: item._id, qty: item.qty })),
        shippingAddress,
        paymentMethod,
        paymentResult: paymentId ? { id: paymentId, status: 'Completed' } : undefined,
        itemsPrice,
        shippingPrice,
        totalAmount
      };

      await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! Thank you for shopping with UrbanKart.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-navy-900 mb-8 text-center">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-orange-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        {['Address', 'Summary', 'Payment'].map((label, idx) => (
          <div key={label} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${step >= idx + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {idx + 1}
            </div>
            <span className={`font-medium ${step >= idx + 1 ? 'text-navy-900' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {step === 1 && (
          <form onSubmit={handleAddressSubmit}>
            <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input required type="text" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input required type="text" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input required type="text" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input required type="text" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="submit" className="bg-navy-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-navy-800 transition-colors">
                Continue to Summary
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-400">{item.name[0]}</span>}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-navy-900 line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="font-semibold">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-navy-900">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg font-medium text-navy-900 hover:bg-gray-100 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="bg-navy-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-navy-800 transition-colors">
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Payment</h2>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
              <p className="text-amber-800 font-medium text-center">Total Amount to Pay: {formatPrice(totalAmount)}</p>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <button 
                disabled={loading}
                onClick={() => handlePayment('Razorpay')} 
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </button>
              
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute border-t border-gray-200 w-full"></div>
                <span className="bg-white px-4 text-sm text-gray-500 relative">OR</span>
              </div>

              <button 
                disabled={loading}
                onClick={() => handlePayment('COD')} 
                className="w-full bg-navy-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-navy-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Placing Order...' : 'Cash on Delivery (COD)'}
              </button>
            </div>

            <div className="mt-8 flex justify-start">
              <button onClick={() => setStep(2)} disabled={loading} className="px-6 py-3 rounded-lg font-medium text-navy-900 hover:bg-gray-100 transition-colors">
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Gateway Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-navy-900 text-white p-5 flex justify-between items-center">
              <div>
                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Razorpay Gateway (Test Mode)</span>
                <h3 className="text-xl font-extrabold flex items-center gap-1.5 mt-0.5">
                  Urban<span className="text-orange-500">Kart</span> Checkout
                </h3>
              </div>
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 text-left">
                <div className="flex justify-between text-sm mb-1 text-blue-950 font-medium">
                  <span>Paying to:</span>
                  <span>UrbanKart Stores</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-navy-900">
                  <span>Total Amount:</span>
                  <span className="text-lg text-orange-600 font-extrabold">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-3 text-left text-sm mb-6">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
                  <span className="font-medium text-gray-700">💳 Card / UPI Simulation</span>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-gray-500">
                  This test mode simulates a real Razorpay payment. Clicking below approves the transaction instantly.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  disabled={loading}
                  onClick={handleCompleteRazorpayTestPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying Payment...' : `Complete Test Payment (${formatPrice(totalAmount)})`}
                </button>
                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
