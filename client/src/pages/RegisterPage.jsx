import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      // Error handled by toast
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
          <h2 className="text-2xl font-semibold mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                type="text"
                required
                className="input-field py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input-field py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="input-field py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <p className="text-xs text-gray-500 mt-1">Passwords must be at least 6 characters.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter password</label>
              <input
                type="password"
                required
                className="input-field py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center py-2 mt-4"
            >
              {isSubmitting ? <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Continue'}
            </button>
          </form>
          
          <div className="mt-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
