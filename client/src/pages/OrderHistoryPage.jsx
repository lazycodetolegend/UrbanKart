import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import { formatPrice } from '../utils/formatPrice';
import { FaBoxOpen, FaChevronRight } from 'react-icons/fa';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data.orders || data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Shipped': return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Order History</h1>

      {!Array.isArray(orders) || orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaBoxOpen className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusVal = order.orderStatus || order.status || 'Placed';
            return (
              <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-navy-900">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(statusVal)}`}>
                        {statusVal}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{order.items?.length || 0} Item{order.items?.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="font-bold text-navy-900">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                      <FaChevronRight />
                    </div>
                  </div>
                  
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
