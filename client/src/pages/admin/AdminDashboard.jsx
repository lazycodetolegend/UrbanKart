import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaShoppingBag, FaBox, FaUsers, FaSync, FaExclamationTriangle, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/stats');
      const data = response.data?.stats || response.data || {};
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Admin session not detected or expired. Please sign in with your administrator account.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch dashboard statistics. Please ensure the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickAdminLogin = async () => {
    setLoggingIn(true);
    try {
      await login('admin@urbankart.com', 'password123');
      await fetchStats();
    } catch (err) {
      setError('Auto-login failed. Please go to the login page.');
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium text-sm">Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-navy-900">Admin Authentication Required</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          {error}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button 
            onClick={handleQuickAdminLogin}
            disabled={loggingIn}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loggingIn ? (
              <Spinner className="w-4 h-4 border-2" />
            ) : (
              <FaShieldAlt className="text-amber-300" />
            )}
            <span>1-Click Sign In as Admin</span>
          </button>
          <Link 
            to="/login"
            state={{ from: { pathname: '/admin' } }}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-xl transition flex items-center justify-center"
          >
            Go to Login Page
          </Link>
          <button 
            onClick={fetchStats}
            className="px-4 py-2.5 text-gray-500 hover:text-navy-900 font-medium text-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalSales = stats?.totalSales ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const totalUsers = stats?.totalUsers ?? 0;
  const bestSelling = stats?.bestSelling || [];
  const lowStock = stats?.lowStock || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">Admin Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time store performance, catalog metrics, and inventory alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition"
          >
            <FaSync className="text-xs" /> Refresh
          </button>
          <Link 
            to="/admin/products/new" 
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm transition shadow-sm"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatPrice(totalSales)} 
          icon={<FaRupeeSign size={22} className="text-emerald-600" />} 
          bgColor="bg-emerald-50 text-emerald-600"
          borderAccent="border-emerald-500"
          link="/admin/orders"
          linkText="View Orders"
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={<FaShoppingBag size={22} className="text-blue-600" />} 
          bgColor="bg-blue-50 text-blue-600"
          borderAccent="border-blue-500"
          link="/admin/orders"
          linkText="Manage Orders"
        />
        <StatCard 
          title="Active Products" 
          value={totalProducts} 
          icon={<FaBox size={22} className="text-orange-600" />} 
          bgColor="bg-orange-50 text-orange-600"
          borderAccent="border-orange-500"
          link="/admin/products"
          linkText="View Catalog"
        />
        <StatCard 
          title="Registered Users" 
          value={totalUsers} 
          icon={<FaUsers size={22} className="text-purple-600" />} 
          bgColor="bg-purple-50 text-purple-600"
          borderAccent="border-purple-500"
          link="/admin/users"
          linkText="View Users"
        />
      </div>

      {/* Two Column Section: Best Selling & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              🔥 Best Selling Products
            </h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              All Orders <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product Name</th>
                  <th className="px-6 py-3 font-semibold text-right">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bestSelling.length > 0 ? (
                  bestSelling.map((product, idx) => (
                    <tr key={product._id || idx} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 text-sm font-medium text-navy-900">
                        {product.name || 'Unnamed Product'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-navy-900 text-right">
                        {product.sold || product.totalQty || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-sm text-gray-400">
                      No order sales recorded yet. Once orders are placed, bestsellers will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              ⚠️ Inventory Stock Watch
            </h2>
            <Link to="/admin/products" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              Manage Stock <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold text-center">Remaining Stock</th>
                  <th className="px-6 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStock.length > 0 ? (
                  lowStock.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 text-sm font-medium text-navy-900 truncate max-w-xs">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-center text-gray-700">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : product.stock <= 20 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : product.stock <= 20 ? 'Critical' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-sm text-gray-400">
                      All products currently have abundant inventory!
                    </td>
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

const StatCard = ({ title, value, icon, bgColor, borderAccent, link, linkText }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 ${borderAccent} flex flex-col justify-between hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
      <div className={`p-2.5 rounded-xl ${bgColor}`}>
        {icon}
      </div>
    </div>
    <div className="mb-4">
      <h3 className="text-3xl font-extrabold text-navy-900 tracking-tight">{value}</h3>
    </div>
    {link && (
      <Link to={link} className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
        {linkText} <FaArrowRight className="text-[10px]" />
      </Link>
    )}
  </div>
);

export default AdminDashboard;
