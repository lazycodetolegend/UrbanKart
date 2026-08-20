import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-bold tracking-tight text-navy-900">
            Urban<span className="text-orange-500">Kart</span>
          </Link>
        </div>
        
        {/* Card */}
        <div className="card p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center py-2"
            >
              {isSubmitting ? <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-sm text-gray-600">
            By continuing, you agree to UrbanKart's{' '}
            <Link to="/conditions" className="text-blue-600 hover:underline">Conditions of Use</Link> and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Notice</Link>.
          </div>
        </div>

        {/* Divider */}
        <div className="relative mt-8 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500">New to UrbanKart?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          to="/register"
          className="w-full block text-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 rounded-md transition shadow-sm"
        >
          Create your UrbanKart account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
