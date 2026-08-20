import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        const orderObj = res.data.order || res.data;
        setOrder(orderObj);
        setStatus(orderObj?.orderStatus || orderObj?.status || 'Placed');
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await api.put(`/orders/${id}/status`, { status });
      setOrder(prev => ({ ...prev, orderStatus: status, status }));
      alert('Order status updated successfully');
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'Placed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-500 text-center font-medium">{error}</div>;
  if (!order) return <div className="p-6 text-gray-500 text-center">Order not found</div>;

  const currentStatus = order.orderStatus || order.status || 'Placed';
  const orderItems = order.items || order.orderItems || [];
  const totalAmount = order.totalAmount ?? order.totalPrice ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 text-gray-500 hover:text-navy-900 bg-white rounded-full shadow-sm">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold text-navy-900">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {currentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-navy-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200 p-6">
              {orderItems.map((item, i) => (
                <div key={item._id || i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-50 rounded border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product?.name || item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-300 text-xl">{item.product?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy-900">{item.product?.name || item.name || 'Product'}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="font-semibold text-navy-900">
                    {formatPrice((item.price || item.product?.price || 0) * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Update Status</h2>
            <div className="flex gap-2">
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Placed">Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button 
                onClick={handleStatusUpdate}
                disabled={updating || status === currentStatus}
                className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900 disabled:opacity-50 font-medium transition-colors"
              >
                {updating ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium text-navy-900">{order.user?.name || 'Customer'}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium text-navy-900">{order.user?.email || '-'}</span></p>
            </div>

            <h2 className="text-lg font-semibold text-navy-900 mt-6 mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingAddress?.name || order.user?.name}</p>
              <p>{order.shippingAddress?.street || order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country || 'India'}</p>
              {order.shippingAddress?.phone && <p className="text-gray-500 pt-2">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items Total</span>
                <span className="font-medium">{formatPrice(order.itemsPrice || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice || 0)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-navy-900">
                <span>Total</span>
                <span className="text-orange-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium text-navy-900">{order.paymentMethod || 'Razorpay'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
