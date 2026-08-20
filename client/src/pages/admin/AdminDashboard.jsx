import { useState, useEffect } from 'react';
import { FaDollarSign, FaShoppingBag, FaBox, FaUsers } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard stats.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={formatPrice(stats?.totalSales || 0)} 
          icon={<FaDollarSign size={24} className="text-emerald-500" />} 
          color="border-l-emerald-500"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={<FaShoppingBag size={24} className="text-blue-500" />} 
          color="border-l-blue-500"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={<FaBox size={24} className="text-orange-500" />} 
          color="border-l-orange-500"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<FaUsers size={24} className="text-purple-500" />} 
          color="border-l-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-navy-800">Best Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Product Name</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-right">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.bestSelling?.length > 0 ? (
                  stats.bestSelling.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-navy-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || product.category || '-'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">{product.sold || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-navy-800">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Product Name</th>
                  <th className="px-6 py-3 font-medium text-right">Stock</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.lowStock?.length > 0 ? (
                  stats.lowStock.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-navy-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600 text-right">{product.stock}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No low stock items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 border-l-4 ${color} flex items-center justify-between`}>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-navy-900">{value}</h3>
    </div>
    <div className="p-3 bg-gray-50 rounded-full">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
