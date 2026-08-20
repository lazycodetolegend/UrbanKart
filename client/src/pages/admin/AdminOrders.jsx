import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders || res.data || []);
      } catch (err) {
        console.error('Admin orders fetch error:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Placed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = statusFilter 
    ? orders.filter(o => (o.orderStatus || o.status) === statusFilter)
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-navy-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center font-medium">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-center">Items</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!Array.isArray(filteredOrders) || filteredOrders.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusVal = order.orderStatus || order.status || 'Placed';
                    const itemsCount = order.items?.length || order.orderItems?.length || 0;
                    const amountVal = order.totalAmount ?? order.totalPrice ?? 0;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-navy-900">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.user?.name || 'Customer'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{itemsCount}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-navy-900 text-right">{formatPrice(amountVal)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statusVal)}`}>
                            {statusVal}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/admin/orders/${order._id}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
