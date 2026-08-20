import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import { formatPrice } from '../utils/formatPrice';
import { FaCheckCircle, FaTruck, FaBox, FaArrowLeft } from 'react-icons/fa';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order || data);
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner />;
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Order Not Found</h2>
        <Link to="/orders" className="text-orange-500 hover:underline">Return to Orders</Link>
      </div>
    );
  }

  const statusVal = order.orderStatus || order.status || 'Placed';
  const statuses = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statusVal === 'Cancelled' ? -1 : statuses.indexOf(statusVal);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition-colors">
        <FaArrowLeft size={14} /> Back to Orders
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Order Details</h1>
          <p className="text-gray-500">Order ID: <span className="font-medium text-gray-900">#{order._id}</span></p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 mb-1">Order Date</p>
          <p className="font-medium text-navy-900">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {statusVal !== 'Cancelled' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="relative flex justify-between items-center mb-8 px-4">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-4 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-500" 
                style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}
              ></div>
              
              {statuses.map((status, idx) => (
                <div key={status} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors ${idx <= currentStatusIndex ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>
                    {idx === 0 ? <FaBox /> : idx === 3 ? <FaCheckCircle /> : <FaTruck />}
                  </div>
                  <span className={`text-sm font-medium ${idx <= currentStatusIndex ? 'text-navy-900' : 'text-gray-400'}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3 border border-red-100">
          <FaCheckCircle className="text-red-500" size={24} />
          <div>
            <p className="font-bold">Order Cancelled</p>
            <p className="text-sm">This order has been cancelled and will not be delivered.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-3">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                       <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <span className="font-bold text-gray-300 text-xl">{item.product?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <Link to={`/products/${item.product?._id}`} className="font-medium text-navy-900 hover:text-orange-500 line-clamp-1">
                      {item.product?.name || 'Unknown Product'}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">Qty: {item.qty} × {formatPrice(item.price || (item.product?.price || 0))}</p>
                  </div>
                  <div className="font-bold text-navy-900">
                    {formatPrice((item.price || (item.product?.price || 0)) * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-3">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-navy-900">
                <span>Total Amount</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
            {order.paymentMethod === 'COD' && statusVal !== 'Delivered' && statusVal !== 'Cancelled' && (
               <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg border border-amber-100 text-center font-medium">
                 To be paid on delivery
               </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-3">Shipping Info</h3>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress?.name || 'Customer'}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-3">Payment Info</h3>
             <div className="text-gray-600 space-y-2">
               <p><span className="text-gray-400">Method:</span> <span className="font-medium text-gray-800">{order.paymentMethod}</span></p>
               <p><span className="text-gray-400">Status:</span> 
                 <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${order.paymentResult?.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                   {order.paymentResult?.status || (order.paymentMethod === 'COD' ? 'Pending' : 'Completed')}
                 </span>
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
