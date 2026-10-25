import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }

  // Not logged in -> send to login with redirect back to admin route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in as regular user -> show access denied instead of silent blank bounce
  if (user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mb-4 font-bold shadow-inner">
          🔒
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 mb-2">Admin Portal Restricted</h1>
        <p className="text-gray-600 max-w-md mb-2">
          You are currently signed in as <span className="font-semibold text-navy-900">{user.email}</span> with customer access.
        </p>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Administrative credentials are required to manage products, categories, orders, and site analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/login" 
            state={{ from: { pathname: '/admin' } }}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
          >
            Sign In with Admin Account
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-xl transition"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
