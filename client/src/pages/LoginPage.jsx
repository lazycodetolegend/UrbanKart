import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaUser } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [errorMsg, setErrorMsg] = useState('');

  const performLogin = async (loginEmail, loginPassword) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const data = await login(loginEmail, loginPassword);
      if (data?.user?.role === 'admin' && from === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await performLogin(email, password);
  };

  const fillAndLogin = (eMail, pwd) => {
    setEmail(eMail);
    setPassword(pwd);
    performLogin(eMail, pwd);
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-navy-900">
            Urban<span className="text-orange-500">Kart</span>
          </Link>
        </div>
        
        {/* Card */}
        <div className="card p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-navy-900">Sign In</h2>
          <p className="text-xs text-gray-500 mb-6">Access your orders, wishlist, or store administration.</p>

          {/* Quick Demo Login Pill Bar */}
          <div className="mb-6 p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-2">
            <span className="block text-xs font-bold text-orange-900 uppercase tracking-wide">
              ⚡ 1-Click Quick Demo Sign In:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => fillAndLogin('admin@urbankart.com', 'password123')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <FaShieldAlt className="text-amber-400 text-xs" /> Admin User
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => fillAndLogin('john@example.com', 'password123')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <FaUser className="text-gray-500 text-xs" /> Customer
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
              </div>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center py-2.5 font-bold text-base mt-2"
            >
              {isSubmitting ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            By continuing, you agree to UrbanKart's{' '}
            <Link to="/conditions" className="text-orange-600 hover:underline">Conditions of Use</Link> and{' '}
            <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Notice</Link>.
          </div>
        </div>

        {/* Divider */}
        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-50 px-2 text-gray-500">New to UrbanKart?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          to="/register"
          className="w-full block text-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
        >
          Create your UrbanKart account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
